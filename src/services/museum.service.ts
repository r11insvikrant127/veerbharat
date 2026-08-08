import Museum from "@/models/museum";
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
  CreateMuseumInput,
  UpdateMuseumInput,
  MuseumQuery,
} from "@/validations/museum";

import { generateNextId } from "@/services/idGenerator.service";
import { ID_PREFIXES } from "@/constants";

class MuseumService extends BaseService {
  async createMuseum(
    data: CreateMuseumInput
  ) {
    await this.connect();

    const existing =
      await Museum.findOne({
        name: new RegExp(
          `^${escapeRegex(data.name)}$`,
          "i"
        ),
      });

    if (existing) {
      throw new ApiError(
        409,
        `Museum '${data.name}' already exists.`
      );
    }

    const museumId =
      await generateNextId(
        ID_PREFIXES.MUS
      );

    const museum =
      await Museum.create({
        ...data,
        museumId,
      });

    return museum;
  }

  async getMuseums(
    query: MuseumQuery
  ) {
    await this.connect();

    const {
      page,
      limit,
      search,
      status,
      type,
      locationId,
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
        "highlights",
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
      filter.locationId =
        locationId;
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

    const [museums, total] =
      await Promise.all([
        Museum.find(filter)
          .sort(sortOption)
          .skip(skip)
          .limit(currentLimit),

        Museum.countDocuments(
          filter
        ),
      ]);

    return {
      data: museums,
      pagination:
        getPaginationMeta(
          currentPage,
          currentLimit,
          total
        ),
    };
  }

  async getMuseumById(
    museumId: string
  ) {
    await this.connect();

    return this.findByPublicIdOrThrow(
      Museum,
      "museumId",
      museumId,
      "Museum"
    );
  }

  async updateMuseum(
    museumId: string,
    data: UpdateMuseumInput
  ) {
    await this.connect();

    const museum =
      await this.findByPublicIdOrThrow(
        Museum,
        "museumId",
        museumId,
        "Museum"
      );

    if (
      data.name &&
      data.name !== museum.name
    ) {
      const existing =
        await Museum.findOne({
          name: new RegExp(
            `^${escapeRegex(
              data.name
            )}$`,
            "i"
          ),
        });

      if (
        existing &&
        existing.museumId !==
          museumId
      ) {
        throw new ApiError(
          409,
          `Museum '${data.name}' already exists.`
        );
      }
    }

    Object.assign(
      museum,
      data
    );

    await museum.save();

    return museum;
  }

  async deleteMuseum(
    museumId: string
  ) {
    await this.connect();

    const museum =
      await this.findByPublicIdOrThrow(
        Museum,
        "museumId",
        museumId,
        "Museum"
      );

    await museum.deleteOne();

    return {
      deleted: true,
      museumId,
    };
  }
}

export default new MuseumService();