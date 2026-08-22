import Memorial from "@/models/memorial";
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
  CreateMemorialInput,
  UpdateMemorialInput,
  MemorialQuery,
} from "@/validations/memorial";

import { generateNextId } from "@/services/idGenerator.service";
import { ID_PREFIXES } from "@/constants";

class MemorialService extends BaseService {
  async createMemorial(
    data: CreateMemorialInput
  ) {
    await this.connect();

    const existing =
      await Memorial.findOne({
        name: new RegExp(
          `^${escapeRegex(data.name)}$`,
          "i"
        ),
      });

    if (existing) {
      throw new ApiError(
        409,
        `Memorial '${data.name}' already exists.`
      );
    }

    const memorialId =
      await generateNextId(
        ID_PREFIXES.MEM
      );

    const memorial =
      await Memorial.create({
        ...data,
        memorialId,
      });

    return memorial;
  }

  async getMemorials(
    query: MemorialQuery
  ) {
    await this.connect();

    const {
      page,
      limit,
      search,
      status,
      type,
      locationId,
      builtBy,
      dedicatedToModel,
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
        "description",
        "significance",
        "tags",
      ])
    );

    if (status) {
      filter.status = status;
    }

    if (type) {
      filter.type = type;
    }

    if (locationId) {
      filter.locationId = locationId;
    }

    if (builtBy) {
      filter.builtBy = builtBy;
    }

    if (dedicatedToModel) {
      filter.dedicatedToModel =
        dedicatedToModel;
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

    const [memorials, total] =
      await Promise.all([
        Memorial.find(filter)
          .sort(sortOption)
          .skip(skip)
          .limit(currentLimit),

        Memorial.countDocuments(
          filter
        ),
      ]);

    return {
      data: memorials,
      pagination:
        getPaginationMeta(
          currentPage,
          currentLimit,
          total
        ),
    };
  }

  async getMemorialById(
    memorialId: string
  ) {
    await this.connect();

    return this.findByPublicIdOrThrow(
      Memorial,
      "memorialId",
      memorialId,
      "Memorial"
    );
  }

  async updateMemorial(
    memorialId: string,
    data: UpdateMemorialInput
  ) {
    await this.connect();

    const memorial =
      await this.findByPublicIdOrThrow(
        Memorial,
        "memorialId",
        memorialId,
        "Memorial"
      );

    if (
      data.name &&
      data.name !== memorial.name
    ) {
      const existing =
        await Memorial.findOne({
          name: new RegExp(
            `^${escapeRegex(
              data.name
            )}$`,
            "i"
          ),
        });

      if (
        existing &&
        existing.memorialId !==
          memorialId
      ) {
        throw new ApiError(
          409,
          `Memorial '${data.name}' already exists.`
        );
      }
    }

    Object.assign(
      memorial,
      data
    );

    await memorial.save();

    return memorial;
  }

  async deleteMemorial(
    memorialId: string
  ) {
    await this.connect();

    const memorial =
      await this.findByPublicIdOrThrow(
        Memorial,
        "memorialId",
        memorialId,
        "Memorial"
      );

    await memorial.deleteOne();

    return {
      deleted: true,
      memorialId,
    };
  }
}

const MemorialServiceInstance = new MemorialService();

export default MemorialServiceInstance;
