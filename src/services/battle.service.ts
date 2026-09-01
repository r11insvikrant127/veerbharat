// src/services/battle.service.ts

import Battle from "@/models/battle";
import ApiError from "@/lib/ApiError";
import BaseService from "./base.service";


import Event from "@/models/event";
import Hero from "@/models/hero";
import HistoricalPersonality from "@/models/historicalPersonality";
import Kingdom from "@/models/kingdom";
import Weapon from "@/models/weapon";
import Place from "@/models/place";
import Book from "@/models/book";
import Source from "@/models/source";
import Image from "@/models/image";
import HistoricalPeriod from "@/models/historicalPeriod";
import MilitaryCommander from "@/models/militaryCommander";
import WarAnimal from "@/models/warAnimal";
import WarStrategy from "@/models/warStrategy";

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

    const battle =
      await this.findByPublicIdOrThrow(
        Battle,
        "battleId",
        battleId,
        "Battle"
      );

    await battle.populate([
      {
        path: "crossReferences.relatedHeroes",
        model: Hero,
        select: "_id name heroId",
      },

      {
        path: "crossReferences.relatedHistoricalPersonalities",
        model: HistoricalPersonality,
        select: "_id name historicalPersonalityId",
      },

      {
        path: "crossReferences.relatedKingdoms",
        model: Kingdom,
        select: "_id name kingdomId",
      },

      {
        path: "crossReferences.relatedEvents",
        model: Event,
        select: "_id name eventId",
      },

      {
        path: "crossReferences.relatedBattles",
        model: Battle,
        select: "_id name battleId",
      },

      {
        path: "crossReferences.relatedPlaces",
        model: Place,
        select: "_id name placeId",
      },

      {
        path: "crossReferences.relatedBooks",
        model: Book,
        select: "_id name bookId",
      },

      {
        path: "crossReferences.relatedSources",
        model: Source,
        select: "_id title sourceId",
      },

      {
        path: "crossReferences.relatedWeapons",
        model: Weapon,
        select: "_id name weaponId",
      },

      {
        path: "crossReferences.relatedImages",
        model: Image,
        select: "_id name imageId",
      },
      
      {
        path: "locationId",
        model: Place,
        select: "_id name placeId",
      },

      {
        path: "historicalPeriodId",
        model: HistoricalPeriod,
        select: "_id name historicalPeriodId",
      },

      {
        path: "kingdomIds",
        model: Kingdom,
        select: "_id name kingdomId",
      },

      {
        path: "commanderIds",
        model: Hero,
        select: "_id name heroId",
      },

      {
        path: "commanderPersonalityIds",
        model: HistoricalPersonality,
        select: "_id name historicalPersonalityId",
      },
    {
      path: "opposingCommanderIds",
      model: MilitaryCommander,
      select: "_id name",
    },

    {
      path: "opposingCommanderPersonalityIds",
      model: HistoricalPersonality,
      select: "_id name historicalPersonalityId",
    },

    {
      path: "victorId",
    },

   

    {
      path: "warAnimalIds",
      model: WarAnimal,
      select: "_id name warAnimalId",
    },

    {
      path: "strategyId",
      model: WarStrategy,
      select: "_id name strategyId",
    },
    ]);

    return battle;
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
