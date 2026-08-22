import Place from "@/models/place";
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
  CreatePlaceInput,
  UpdatePlaceInput,
  PlaceQuery,
} from "@/validations/place";

import { generateNextId } from "@/services/idGenerator.service";
import { ID_PREFIXES } from "@/constants";

class PlaceService extends BaseService {
  async createPlace(
    data: CreatePlaceInput
  ) {
    await this.connect();

    const existing = await Place.findOne({
      name: new RegExp(
        `^${escapeRegex(data.name)}$`,
        "i"
      ),
    });

    if (existing) {
      throw new ApiError(
        409,
        `Place '${data.name}' already exists.`
      );
    }

    const placeId =
      await generateNextId(
        ID_PREFIXES.PLC
      );

    const place =
      await Place.create({
        ...data,
        placeId,
      });

    return place;
  }

  async getPlaces(
    query: PlaceQuery
  ) {
    await this.connect();

    const {
      page,
      limit,
      search,
      status,
      historicalPeriodId,
      type,
      state,
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
        "alternativeNames",
      ])
    );

    if (status) {
      filter.status = status;
    }

    if (historicalPeriodId) {
      filter.historicalPeriodId =
        historicalPeriodId;
    }

    if (type) {
      filter.type = type;
    }

    if (state) {
      filter.state = state;
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

    const [places, total] =
      await Promise.all([
        Place.find(filter)
          .sort(sortOption)
          .skip(skip)
          .limit(currentLimit),

        Place.countDocuments(
          filter
        ),
      ]);

    return {
      data: places,
      pagination:
        getPaginationMeta(
          currentPage,
          currentLimit,
          total
        ),
    };
  }

  async getPlaceById(
    placeId: string
  ) {
    await this.connect();

    return this.findByPublicIdOrThrow(
      Place,
      "placeId",
      placeId,
      "Place"
    );
  }

  async updatePlace(
    placeId: string,
    data: UpdatePlaceInput
  ) {
    await this.connect();

    const place =
      await this.findByPublicIdOrThrow(
        Place,
        "placeId",
        placeId,
        "Place"
      );

    if (
      data.name &&
      data.name !== place.name
    ) {
      const existing =
        await Place.findOne({
          name: new RegExp(
            `^${escapeRegex(
              data.name
            )}$`,
            "i"
          ),
        });

      if (
        existing &&
        existing.placeId !==
          placeId
      ) {
        throw new ApiError(
          409,
          `Place '${data.name}' already exists.`
        );
      }
    }

    Object.assign(
      place,
      data
    );

    await place.save();

    return place;
  }

  async deletePlace(
    placeId: string
  ) {
    await this.connect();

    const place =
      await this.findByPublicIdOrThrow(
        Place,
        "placeId",
        placeId,
        "Place"
      );

    await place.deleteOne();

    return {
      deleted: true,
      placeId,
    };
  }
}

const PlaceServiceInstance = new PlaceService();

export default PlaceServiceInstance;
