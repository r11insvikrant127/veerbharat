// src/services/dynasty.service.ts

import Dynasty from "@/models/dynasty";
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
  CreateDynastyInput,
  UpdateDynastyInput,
  DynastyQuery,
} from "@/validations/dynasty";

import { generateNextId } from "@/services/idGenerator.service";
import { ID_PREFIXES } from "@/constants";

class DynastyService extends BaseService {
  async createDynasty(
    data: CreateDynastyInput
  ) {
    await this.connect();

    const existing =
      await Dynasty.findOne({
        name: new RegExp(
          `^${escapeRegex(data.name)}$`,
          "i"
        ),
      });

    if (existing) {
      throw new ApiError(
        409,
        `Dynasty '${data.name}' already exists.`
      );
    }

    const dynastyId =
      await generateNextId(
        ID_PREFIXES.DYN
      );

    const dynasty =
      await Dynasty.create({
        ...data,
        dynastyId,
      });

    return dynasty;
  }

  async getDynasties(
    query: DynastyQuery
  ) {
    await this.connect();

    const {
      page,
      limit,
      search,
      status,
      kingdomId,
      founderId,
      historicalPeriodId,
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
        "alternativeNames",
        "tags",
      ])
    );

    if (status) {
      filter.status = status;
    }

    if (kingdomId) {
      filter.kingdomId = kingdomId;
    }

    if (founderId) {
      filter.founderId = founderId;
    }

    if (historicalPeriodId) {
      filter.historicalPeriodId =
        historicalPeriodId;
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

    const [dynasties, total] =
      await Promise.all([
        Dynasty.find(filter)
          .sort(sortOption)
          .skip(skip)
          .limit(currentLimit),

        Dynasty.countDocuments(
          filter
        ),
      ]);

    return {
      data: dynasties,
      pagination:
        getPaginationMeta(
          currentPage,
          currentLimit,
          total
        ),
    };
  }

  async getDynastyById(
    dynastyId: string
  ) {
    await this.connect();

    return this.findByPublicIdOrThrow(
      Dynasty,
      "dynastyId",
      dynastyId,
      "Dynasty"
    );
  }

  async updateDynasty(
    dynastyId: string,
    data: UpdateDynastyInput
  ) {
    await this.connect();

    const dynasty =
      await this.findByPublicIdOrThrow(
        Dynasty,
        "dynastyId",
        dynastyId,
        "Dynasty"
      );

    if (
      data.name &&
      data.name !== dynasty.name
    ) {
      const existing =
        await Dynasty.findOne({
          name: new RegExp(
            `^${escapeRegex(
              data.name
            )}$`,
            "i"
          ),
        });

      if (
        existing &&
        existing.dynastyId !==
          dynastyId
      ) {
        throw new ApiError(
          409,
          `Dynasty '${data.name}' already exists.`
        );
      }
    }

    Object.assign(
      dynasty,
      data
    );

    await dynasty.save();

    return dynasty;
  }

  async deleteDynasty(
    dynastyId: string
  ) {
    await this.connect();

    const dynasty =
      await this.findByPublicIdOrThrow(
        Dynasty,
        "dynastyId",
        dynastyId,
        "Dynasty"
      );

    await dynasty.deleteOne();

    return {
      deleted: true,
      dynastyId,
    };
  }
}

export default new DynastyService();