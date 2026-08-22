// src/services/source.service.ts

import Source from "@/models/source";
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
  CreateSourceInput,
  UpdateSourceInput,
  SourceQuery,
} from "@/validations/source";

import { generateNextId } from "@/services/idGenerator.service";
import { ID_PREFIXES } from "@/constants";

class SourceService extends BaseService {
  async createSource(
    data: CreateSourceInput
  ) {
    await this.connect();

    const existing =
      await Source.findOne({
        title: new RegExp(
          `^${escapeRegex(data.title)}$`,
          "i"
        ),
      });

    if (existing) {
      throw new ApiError(
        409,
        `Source '${data.title}' already exists.`
      );
    }

    const sourceId =
      await generateNextId(
        ID_PREFIXES.SRC
      );

    const source =
      await Source.create({
        ...data,
        sourceId,
      });

    return source;
  }

  async getSources(
    query: SourceQuery
  ) {
    await this.connect();

    const {
      page,
      limit,
      search,
      status,
      type,
      reliability,
      author,
      language,
      publisher,
      sort,
    } = query;

    const filter: Record<
      string,
      unknown
    > = {};

    Object.assign(
      filter,
      buildSearchFilter(search, [
        "title",
        "author",
        "tags",
      ])
    );

    if (status) {
      filter.status = status;
    }

    if (type) {
      filter.type = type;
    }

    if (reliability) {
      filter.reliability =
        reliability;
    }

    if (author) {
      filter.author = new RegExp(
        `^${escapeRegex(author)}$`,
        "i"
      );
    }

    if (language) {
      filter.language = new RegExp(
        `^${escapeRegex(language)}$`,
        "i"
      );
    }

    if (publisher) {
      filter.publisher = new RegExp(
        `^${escapeRegex(publisher)}$`,
        "i"
      );
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

    const [sources, total] =
      await Promise.all([
        Source.find(filter)
          .sort(sortOption)
          .skip(skip)
          .limit(currentLimit),

        Source.countDocuments(
          filter
        ),
      ]);

    return {
      data: sources,
      pagination:
        getPaginationMeta(
          currentPage,
          currentLimit,
          total
        ),
    };
  }

  async getSourceById(
    sourceId: string
  ) {
    await this.connect();

    return this.findByPublicIdOrThrow(
      Source,
      "sourceId",
      sourceId,
      "Source"
    );
  }

  async updateSource(
    sourceId: string,
    data: UpdateSourceInput
  ) {
    await this.connect();

    const source =
      await this.findByPublicIdOrThrow(
        Source,
        "sourceId",
        sourceId,
        "Source"
      );

    if (
      data.title &&
      data.title !== source.title
    ) {
      const existing =
        await Source.findOne({
          title: new RegExp(
            `^${escapeRegex(
              data.title
            )}$`,
            "i"
          ),
        });

      if (
        existing &&
        existing.sourceId !==
          sourceId
      ) {
        throw new ApiError(
          409,
          `Source '${data.title}' already exists.`
        );
      }
    }

    Object.assign(
      source,
      data
    );

    await source.save();

    return source;
  }

  async deleteSource(
    sourceId: string
  ) {
    await this.connect();

    const source =
      await this.findByPublicIdOrThrow(
        Source,
        "sourceId",
        sourceId,
        "Source"
      );

    await source.deleteOne();

    return {
      deleted: true,
      sourceId,
    };
  }
}

const SourceServiceInstance = new SourceService();

export default SourceServiceInstance;
