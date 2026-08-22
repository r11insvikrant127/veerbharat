import Fort from "@/models/fort";
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
  CreateFortInput,
  UpdateFortInput,
  FortQuery,
} from "@/validations/fort";

import { generateNextId } from "@/services/idGenerator.service";
import { ID_PREFIXES } from "@/constants";

class FortService extends BaseService {
  async createFort(
    data: CreateFortInput
  ) {
    await this.connect();

    const existing =
      await Fort.findOne({
        name: new RegExp(
          `^${escapeRegex(data.name)}$`,
          "i"
        ),
      });

    if (existing) {
      throw new ApiError(
        409,
        `Fort '${data.name}' already exists.`
      );
    }

    const fortId =
      await generateNextId(
        ID_PREFIXES.FRT
      );

    const fort =
      await Fort.create({
        ...data,
        fortId,
      });

    return fort;
  }

  async getForts(
    query: FortQuery
  ) {
    await this.connect();

    const {
      page,
      limit,
      search,
      status,
      fortStatus,
      locationId,
      builderId,
      kingdomId,
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
        "architectureStyle",
        "features",
        "tags",
      ])
    );

    if (status) {
      filter.status = status;
    }

    if (fortStatus) {
      filter.fortStatus = fortStatus;
    }

    if (locationId) {
      filter.locationId = locationId;
    }

    if (builderId) {
      filter.builderId = builderId;
    }

    if (kingdomId) {
      filter.kingdomId = kingdomId;
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

    const [forts, total] =
      await Promise.all([
        Fort.find(filter)
          .sort(sortOption)
          .skip(skip)
          .limit(currentLimit),

        Fort.countDocuments(
          filter
        ),
      ]);

    return {
      data: forts,
      pagination:
        getPaginationMeta(
          currentPage,
          currentLimit,
          total
        ),
    };
  }

  async getFortById(
    fortId: string
  ) {
    await this.connect();

    return this.findByPublicIdOrThrow(
      Fort,
      "fortId",
      fortId,
      "Fort"
    );
  }

  async updateFort(
    fortId: string,
    data: UpdateFortInput
  ) {
    await this.connect();

    const fort =
      await this.findByPublicIdOrThrow(
        Fort,
        "fortId",
        fortId,
        "Fort"
      );

    if (
      data.name &&
      data.name !== fort.name
    ) {
      const existing =
        await Fort.findOne({
          name: new RegExp(
            `^${escapeRegex(
              data.name
            )}$`,
            "i"
          ),
        });

      if (
        existing &&
        existing.fortId !== fortId
      ) {
        throw new ApiError(
          409,
          `Fort '${data.name}' already exists.`
        );
      }
    }

    Object.assign(
      fort,
      data
    );

    await fort.save();

    return fort;
  }

  async deleteFort(
    fortId: string
  ) {
    await this.connect();

    const fort =
      await this.findByPublicIdOrThrow(
        Fort,
        "fortId",
        fortId,
        "Fort"
      );

    await fort.deleteOne();

    return {
      deleted: true,
      fortId,
    };
  }
}

const FortServiceInstance = new FortService();

export default FortServiceInstance;
