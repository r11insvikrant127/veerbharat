// src/services/battle.service.ts

import Battle from "@/models/battle";
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
  CreateBattleInput,
  UpdateBattleInput,
  BattleQuery,
} from "@/validations/battle";

import { generateNextId } from "@/services/idGenerator.service";
import { ID_PREFIXES } from "@/constants";

class BattleService extends BaseService {
  async createBattle(
    data: CreateBattleInput
  ) {
    await this.connect();

    const existing =
      await Battle.findOne({
        name: new RegExp(
          `^${escapeRegex(data.name)}$`,
          "i"
        ),
      });

    if (existing) {
      throw new ApiError(
        409,
        `Battle '${data.name}' already exists.`
      );
    }

    const battleId =
      await generateNextId(
        ID_PREFIXES.BTL
      );

    const battle =
      await Battle.create({
        ...data,
        battleId,
      });

    return battle;
  }

  async getBattles(
    query: BattleQuery
  ) {
    await this.connect();

    const {
      page,
      limit,
      search,
      status,
      historicalPeriodId,
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

    const [battles, total] =
      await Promise.all([
        Battle.find(filter)
          .sort(sortOption)
          .skip(skip)
          .limit(currentLimit),

        Battle.countDocuments(
          filter
        ),
      ]);

    return {
    data: battles,
    pagination: getPaginationMeta(
        currentPage,
        currentLimit,
        total
    ),
    };
  }


  async getBattleById(
    battleId: string
  ) {
    await this.connect();

    return this.findByPublicIdOrThrow(
    Battle,
    "battleId",
    battleId,
    "Battle"
    );
  }

  async updateBattle(
    battleId: string,
    data: UpdateBattleInput
  ) {
    await this.connect();

    const battle =
    await this.findByPublicIdOrThrow(
        Battle,
        "battleId",
        battleId,
        "Battle"
    );

    if (
      data.name &&
      data.name !== battle.name
    ) {
      const existing =
        await Battle.findOne({
          name: new RegExp(
            `^${escapeRegex(
              data.name
            )}$`,
            "i"
          ),
        });

      if (
        existing &&
        existing.battleId !==
          battleId
      ) {
        throw new ApiError(
          409,
          `Battle '${data.name}' already exists.`
        );
      }
    }

    Object.assign(
      battle,
      data
    );

    await battle.save();

    return battle;
  }

  async deleteBattle(
    battleId: string
  ) {
    await this.connect();

    const battle =
    await this.findByPublicIdOrThrow(
        Battle,
        "battleId",
        battleId,
        "Battle"
    );

    await battle.deleteOne();

    return {
      deleted: true,
      battleId,
    };
  }
}

const BattleServiceInstance = new BattleService();

export default BattleServiceInstance;
