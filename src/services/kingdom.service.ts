// src/services/kingdom.service.ts

import Kingdom from "@/models/kingdom";
import ApiError from "@/lib/ApiError";
import BaseService from "./base.service";

import {
  getSearchRegex,
  escapeRegex,
} from "@/helpers/search";

import { getPagination } from "@/helpers/pagination";
import { getSort } from "@/helpers/sorting";

import {
  CreateKingdomInput,
  UpdateKingdomInput,
  KingdomQuery,
} from "@/validations/kingdom";

import { generateNextId } from "@/services/idGenerator.service";
import { ID_PREFIXES } from "@/constants";

class KingdomService extends BaseService {
  async createKingdom(
    data: CreateKingdomInput
  ) {
    await this.connect();

    const existing = await Kingdom.findOne({
      name: new RegExp(
        `^${escapeRegex(data.name)}$`,
        "i"
      ),
    });

    if (existing) {
      throw new ApiError(
        409,
        `Kingdom '${data.name}' already exists.`
      );
    }

    const kingdomId =
      await generateNextId(
        ID_PREFIXES.KNG
      );

    const kingdom =
      await Kingdom.create({
        ...data,
        kingdomId,
      });

    return kingdom;
  }

  async getKingdoms(
    query: KingdomQuery
  ) {
    await this.connect();

    const {
      page,
      limit,
      search,
      status,
      dynastyId,
      founderId,
      historicalPeriodId,
      sort,
    } = query;

    const filter: Record<
      string,
      unknown
    > = {};

    const regex =
      getSearchRegex(search);

    if (regex) {
      filter.$or = [
        { name: regex },
        { nativeName: regex },
        {
          alternativeNames: regex,
        },
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (dynastyId) {
      filter.dynastyId =
        dynastyId;
    }

    if (founderId) {
      filter.founderId =
        founderId;
    }

    if (
      historicalPeriodId
    ) {
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

    const [kingdoms, total] =
      await Promise.all([
        Kingdom.find(filter)
          .sort(sortOption)
          .skip(skip)
          .limit(currentLimit),

        Kingdom.countDocuments(
          filter
        ),
      ]);

    return {
      data: kingdoms,

      pagination: {
        page: currentPage,

        limit: currentLimit,

        total,

        totalPages:
          Math.ceil(
            total /
              currentLimit
          ),
      },
    };
  }

  private async findKingdomOrThrow(
    kingdomId: string
  ) {
    const kingdom =
      await Kingdom.findOne({
        kingdomId,
      });

    if (!kingdom) {
      throw new ApiError(
        404,
        "Kingdom not found."
      );
    }

    return kingdom;
  }

  async getKingdomById(
    kingdomId: string
  ) {
    await this.connect();

    return this.findKingdomOrThrow(
      kingdomId
    );
  }

  async updateKingdom(
    kingdomId: string,
    data: UpdateKingdomInput
  ) {
    await this.connect();

    const kingdom =
      await this.findKingdomOrThrow(
        kingdomId
      );

    if (
      data.name &&
      data.name !== kingdom.name
    ) {
      const existing =
        await Kingdom.findOne({
          name: new RegExp(
            `^${escapeRegex(
              data.name
            )}$`,
            "i"
          ),
        });

      if (
        existing &&
        existing.kingdomId !==
          kingdomId
      ) {
        throw new ApiError(
          409,
          `Kingdom '${data.name}' already exists.`
        );
      }
    }

    Object.assign(
      kingdom,
      data
    );

    await kingdom.save();

    return kingdom;
  }

  async deleteKingdom(
    kingdomId: string
  ) {
    await this.connect();

    const kingdom =
      await this.findKingdomOrThrow(
        kingdomId
      );

    await kingdom.deleteOne();

    return {
      deleted: true,
      kingdomId,
    };
  }
}

const KingdomServiceInstance = new KingdomService();

export default KingdomServiceInstance;
