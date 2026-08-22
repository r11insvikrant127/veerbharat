import Tribe from "@/models/tribe";
import ApiError from "@/lib/ApiError";
import BaseService from "./base.service";

import {
  buildSearchFilter,
  escapeRegex,
} from "@/helpers/search";

import {
  getPagination,
  getPaginationMeta,
} from "@/helpers/pagination";

import { getSort } from "@/helpers/sorting";

import {
  CreateTribeInput,
  UpdateTribeInput,
  TribeQuery,
} from "@/validations/tribe";

import { generateNextId } from "@/services/idGenerator.service";
import { ID_PREFIXES } from "@/constants";

class TribeService extends BaseService {
  async createTribe(
    data: CreateTribeInput
  ) {
    await this.connect();

    const existing =
      await Tribe.findOne({
        name: new RegExp(
          `^${escapeRegex(data.name)}$`,
          "i"
        ),
      });

    if (existing) {
      throw new ApiError(
        409,
        `Tribe '${data.name}' already exists.`
      );
    }

    const tribeId =
      await generateNextId(
        ID_PREFIXES.TRB
      );

    const tribe =
      await Tribe.create({
        ...data,
        tribeId,
      });

    return tribe;
  }

  async getTribes(
    query: TribeQuery
  ) {
    await this.connect();

    const {
      page,
      limit,
      search,
      status,
      region,
      sort,
    } = query;

    const filter: Record<
      string,
      unknown
    > = {};

    Object.assign(
      filter,
      buildSearchFilter(search, [
        "name",
        "nativeName",
        "region",
        "historicalRole",
        "tags",
      ])
    );

    if (status) {
      filter.status = status;
    }

    if (region) {
      filter.region = region;
    }

    const {
      page: currentPage,
      limit: currentLimit,
      skip,
    } = getPagination(
      page,
      limit
    );

    const sortOption =
      getSort(sort);

    const [tribes, total] =
      await Promise.all([
        Tribe.find(filter)
          .sort(sortOption)
          .skip(skip)
          .limit(currentLimit),

        Tribe.countDocuments(
          filter
        ),
      ]);

    return {
      data: tribes,
      pagination:
        getPaginationMeta(
          currentPage,
          currentLimit,
          total
        ),
    };
  }

  async getTribeById(
    tribeId: string
  ) {
    await this.connect();

    return this.findByPublicIdOrThrow(
      Tribe,
      "tribeId",
      tribeId,
      "Tribe"
    );
  }

  async updateTribe(
    tribeId: string,
    data: UpdateTribeInput
  ) {
    await this.connect();

    const tribe =
      await this.findByPublicIdOrThrow(
        Tribe,
        "tribeId",
        tribeId,
        "Tribe"
      );

    if (
      data.name &&
      data.name !== tribe.name
    ) {
      const existing =
        await Tribe.findOne({
          name: new RegExp(
            `^${escapeRegex(
              data.name
            )}$`,
            "i"
          ),
        });

      if (
        existing &&
        existing.tribeId !== tribeId
      ) {
        throw new ApiError(
          409,
          `Tribe '${data.name}' already exists.`
        );
      }
    }

    Object.assign(
      tribe,
      data
    );

    await tribe.save();

    return tribe;
  }

  async deleteTribe(
    tribeId: string
  ) {
    await this.connect();

    const tribe =
      await this.findByPublicIdOrThrow(
        Tribe,
        "tribeId",
        tribeId,
        "Tribe"
      );

    await tribe.deleteOne();

    return {
      deleted: true,
      tribeId,
    };
  }
}

const TribeServiceInstance = new TribeService();

export default TribeServiceInstance;
