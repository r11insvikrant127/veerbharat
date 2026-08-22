// src/services/image.service.ts

import Image from "@/models/image";
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
  CreateImageInput,
  UpdateImageInput,
  ImageQuery,
} from "@/validations/image";

import { generateNextId } from "@/services/idGenerator.service";
import { ID_PREFIXES } from "@/constants";

class ImageService extends BaseService {
  async createImage(
    data: CreateImageInput
  ) {
    await this.connect();

    const existing =
      await Image.findOne({
        title: new RegExp(
          `^${escapeRegex(data.title)}$`,
          "i"
        ),
      });

    if (existing) {
      throw new ApiError(
        409,
        `Image '${data.title}' already exists.`
      );
    }

    const imageId =
      await generateNextId(
        ID_PREFIXES.IMG
      );

    const image =
      await Image.create({
        ...data,
        imageId,
      });

    return image;
  }

  async getImages(
    query: ImageQuery
  ) {
    await this.connect();

    const {
      page,
      limit,
      search,
      status,
      imageType,
      sourceId,
      painting,
      aiGenerated,
      restored,
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
        "altText",
        "tags",
      ])
    );

    if (status) {
      filter.status = status;
    }

    if (imageType) {
      filter.imageType = imageType;
    }

    if (sourceId) {
      filter.sourceId = sourceId;
    }

    if (
      painting !== undefined
    ) {
      filter.painting = painting;
    }

    if (
      aiGenerated !== undefined
    ) {
      filter.aiGenerated =
        aiGenerated;
    }

    if (
      restored !== undefined
    ) {
      filter.restored = restored;
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

    const [images, total] =
      await Promise.all([
        Image.find(filter)
          .sort(sortOption)
          .skip(skip)
          .limit(currentLimit),

        Image.countDocuments(
          filter
        ),
      ]);

    return {
      data: images,
      pagination:
        getPaginationMeta(
          currentPage,
          currentLimit,
          total
        ),
    };
  }

  async getImageById(
    imageId: string
  ) {
    await this.connect();

    return this.findByPublicIdOrThrow(
      Image,
      "imageId",
      imageId,
      "Image"
    );
  }

  async updateImage(
    imageId: string,
    data: UpdateImageInput
  ) {
    await this.connect();

    const image =
      await this.findByPublicIdOrThrow(
        Image,
        "imageId",
        imageId,
        "Image"
      );

    if (
      data.title &&
      data.title !== image.title
    ) {
      const existing =
        await Image.findOne({
          title: new RegExp(
            `^${escapeRegex(
              data.title
            )}$`,
            "i"
          ),
        });

      if (
        existing &&
        existing.imageId !==
          imageId
      ) {
        throw new ApiError(
          409,
          `Image '${data.title}' already exists.`
        );
      }
    }

    Object.assign(
      image,
      data
    );

    await image.save();

    return image;
  }

  async deleteImage(
    imageId: string
  ) {
    await this.connect();

    const image =
      await this.findByPublicIdOrThrow(
        Image,
        "imageId",
        imageId,
        "Image"
      );

    await image.deleteOne();

    return {
      deleted: true,
      imageId,
    };
  }
}

const ImageServiceInstance = new ImageService();

export default ImageServiceInstance;
