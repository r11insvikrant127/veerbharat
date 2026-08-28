import HistoricalPersonality from "@/models/historicalPersonality";
import "@/models/image";
import ApiError from "@/lib/ApiError";
import BaseService from "./base.service";

import {
  getSearchRegex,
  escapeRegex,
} from "@/helpers/search";

import { getPagination } from "@/helpers/pagination";
import { getSort } from "@/helpers/sorting";

import {
  CreateHistoricalPersonalityInput,
  HistoricalPersonalityQuery,
} from "@/validations/historicalPersonality";

class HistoricalPersonalityService extends BaseService {
  async createHistoricalPersonality(
    data: CreateHistoricalPersonalityInput
  ) {
    await this.connect();

    // Check for duplicate name
    const existingPersonality =
      await HistoricalPersonality.findOne({
        name: new RegExp(
          `^${escapeRegex(data.name)}$`,
          "i"
        ),
      });

    if (existingPersonality) {
      throw new ApiError(
        409,
        `Historical Personality '${data.name}' already exists.`
      );
    }

    // Find the latest Historical Personality ID
    const latestPersonality =
      await HistoricalPersonality.findOne({
        historicalPersonalityId: {
          $regex: /^HP\d+$/,
        },
      })
        .sort({
          historicalPersonalityId: -1,
        })
        .lean();

    let nextNumber = 1;

    if (latestPersonality?.historicalPersonalityId) {
      const currentNumber = Number(
        latestPersonality.historicalPersonalityId.replace(
          "HP",
          ""
        )
      );

      nextNumber = currentNumber + 1;
    }

    // Generate ID: HP001, HP002, HP003...
    const historicalPersonalityId = `HP${String(
      nextNumber
    ).padStart(4, "0")}`;

    const historicalPersonality =
      await HistoricalPersonality.create({
        ...data,
        historicalPersonalityId,
      });

    return historicalPersonality;
  }

  async getHistoricalPersonalities(
    query: HistoricalPersonalityQuery
  ) {
    await this.connect();

    const {
      page,
      limit,
      search,
      status,
      sort,
    } = query;

    const filter: Record<string, unknown> = {};

    // Search by name
    const regex = getSearchRegex(search);

    if (regex) {
      filter.name = regex;
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    const {
      page: currentPage,
      limit: currentLimit,
      skip,
    } = getPagination(page, limit);

    const sortOption = getSort(sort);

    const [historicalPersonalities, total] =
      await Promise.all([
        HistoricalPersonality.find(filter)
          .populate({
            path: "imageIds",
            select:
              "imageId title url altText imageType",
          })
          .sort(sortOption)
          .skip(skip)
          .limit(currentLimit),

        HistoricalPersonality.countDocuments(filter),
      ]);

    return {
      data: historicalPersonalities,

      pagination: {
        page: currentPage,
        limit: currentLimit,
        total,
        totalPages: Math.ceil(
          total / currentLimit
        ),
      },
    };
  }

  async getHistoricalPersonalityById(
    historicalPersonalityId: string
    ) {
    await this.connect();

    const historicalPersonality =
        await HistoricalPersonality.findOne({
        historicalPersonalityId,
        }).populate({
        path: "imageIds",
        select:
            "imageId title url altText imageType",
        });

    return historicalPersonality;
    }
}

const HistoricalPersonalityServiceInstance =
  new HistoricalPersonalityService();

export default HistoricalPersonalityServiceInstance;