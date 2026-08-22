import Alliance from "@/models/alliance";
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
  CreateAllianceInput,
  UpdateAllianceInput,
  AllianceQuery,
} from "@/validations/alliance";

import { generateNextId } from "@/services/idGenerator.service";
import { ID_PREFIXES } from "@/constants";

class AllianceService extends BaseService {
  async createAlliance(
    data: CreateAllianceInput
  ) {
    await this.connect();

    const existing =
      await Alliance.findOne({
        name: new RegExp(
          `^${escapeRegex(data.name)}$`,
          "i"
        ),
      });

    if (existing) {
      throw new ApiError(
        409,
        `Alliance '${data.name}' already exists.`
      );
    }

    const allianceId =
      await generateNextId(
        ID_PREFIXES.ALL
      );

    const alliance =
      await Alliance.create({
        ...data,
        allianceId,
      });

    return alliance;
  }

  async getAlliances(
    query: AllianceQuery
  ) {
    await this.connect();

    const {
      page,
      limit,
      search,
      status,
      type,
      partyModel,
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
        "description",
        "notableContributions",
        "tags",
      ])
    );

    if (status) {
      filter.status = status;
    }

    if (type) {
      filter.type = type;
    }

    if (partyModel) {
      filter.partyModel = partyModel;
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

    const [alliances, total] =
      await Promise.all([
        Alliance.find(filter)
          .sort(sortOption)
          .skip(skip)
          .limit(currentLimit),

        Alliance.countDocuments(
          filter
        ),
      ]);

    return {
      data: alliances,
      pagination:
        getPaginationMeta(
          currentPage,
          currentLimit,
          total
        ),
    };
  }

  async getAllianceById(
    allianceId: string
  ) {
    await this.connect();

    return this.findByPublicIdOrThrow(
      Alliance,
      "allianceId",
      allianceId,
      "Alliance"
    );
  }

  async updateAlliance(
    allianceId: string,
    data: UpdateAllianceInput
  ) {
    await this.connect();

    const alliance =
      await this.findByPublicIdOrThrow(
        Alliance,
        "allianceId",
        allianceId,
        "Alliance"
      );

    if (
      data.name &&
      data.name !== alliance.name
    ) {
      const existing =
        await Alliance.findOne({
          name: new RegExp(
            `^${escapeRegex(
              data.name
            )}$`,
            "i"
          ),
        });

      if (
        existing &&
        existing.allianceId !==
          allianceId
      ) {
        throw new ApiError(
          409,
          `Alliance '${data.name}' already exists.`
        );
      }
    }

    Object.assign(
      alliance,
      data
    );

    await alliance.save();

    return alliance;
  }

  async deleteAlliance(
    allianceId: string
  ) {
    await this.connect();

    const alliance =
      await this.findByPublicIdOrThrow(
        Alliance,
        "allianceId",
        allianceId,
        "Alliance"
      );

    await alliance.deleteOne();

    return {
      deleted: true,
      allianceId,
    };
  }
}

const AllianceServiceInstance = new AllianceService();

export default AllianceServiceInstance;
