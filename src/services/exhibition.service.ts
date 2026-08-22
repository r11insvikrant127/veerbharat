import Exhibition from "@/models/exhibition";
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
  CreateExhibitionInput,
  UpdateExhibitionInput,
  ExhibitionQuery,
} from "@/validations/exhibition";

import { generateNextId } from "@/services/idGenerator.service";
import { ID_PREFIXES } from "@/constants";

class ExhibitionService extends BaseService {
  async createExhibition(
    data: CreateExhibitionInput
  ) {
    await this.connect();

    const existing =
      await Exhibition.findOne({
        name: new RegExp(
          `^${escapeRegex(data.name)}$`,
          "i"
        ),
      });

    if (existing) {
      throw new ApiError(
        409,
        `Exhibition '${data.name}' already exists.`
      );
    }

    const exhibitionId =
      await generateNextId(
        ID_PREFIXES.EXH
      );

    const exhibition =
      await Exhibition.create({
        ...data,
        exhibitionId,
      });

    return exhibition;
  }

  async getExhibitions(
    query: ExhibitionQuery
  ) {
    await this.connect();

    const {
      page,
      limit,
      search,
      status,
      museumId,
      theme,
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
        "theme",
        "tags",
      ])
    );

    if (status) {
      filter.status = status;
    }

    if (museumId) {
      filter.museumId = museumId;
    }

    if (theme) {
      filter.theme = theme;
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

    const [exhibitions, total] =
      await Promise.all([
        Exhibition.find(filter)
          .sort(sortOption)
          .skip(skip)
          .limit(currentLimit),

        Exhibition.countDocuments(
          filter
        ),
      ]);

    return {
      data: exhibitions,
      pagination:
        getPaginationMeta(
          currentPage,
          currentLimit,
          total
        ),
    };
  }

  async getExhibitionById(
    exhibitionId: string
  ) {
    await this.connect();

    return this.findByPublicIdOrThrow(
      Exhibition,
      "exhibitionId",
      exhibitionId,
      "Exhibition"
    );
  }

  async updateExhibition(
    exhibitionId: string,
    data: UpdateExhibitionInput
  ) {
    await this.connect();

    const exhibition =
      await this.findByPublicIdOrThrow(
        Exhibition,
        "exhibitionId",
        exhibitionId,
        "Exhibition"
      );

    if (
      data.name &&
      data.name !== exhibition.name
    ) {
      const existing =
        await Exhibition.findOne({
          name: new RegExp(
            `^${escapeRegex(
              data.name
            )}$`,
            "i"
          ),
        });

      if (
        existing &&
        existing.exhibitionId !==
          exhibitionId
      ) {
        throw new ApiError(
          409,
          `Exhibition '${data.name}' already exists.`
        );
      }
    }

    Object.assign(
      exhibition,
      data
    );

    await exhibition.save();

    return exhibition;
  }

  async deleteExhibition(
    exhibitionId: string
  ) {
    await this.connect();

    const exhibition =
      await this.findByPublicIdOrThrow(
        Exhibition,
        "exhibitionId",
        exhibitionId,
        "Exhibition"
      );

    await exhibition.deleteOne();

    return {
      deleted: true,
      exhibitionId,
    };
  }
}

const ExhibitionServiceInstance = new ExhibitionService();

export default ExhibitionServiceInstance;
