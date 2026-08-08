import WarAnimal from "@/models/warAnimal";
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
  CreateWarAnimalInput,
  UpdateWarAnimalInput,
  WarAnimalQuery,
} from "@/validations/warAnimal";

import { generateNextId } from "@/services/idGenerator.service";
import { ID_PREFIXES } from "@/constants";

class WarAnimalService extends BaseService {
  async createWarAnimal(
    data: CreateWarAnimalInput
  ) {
    await this.connect();

    const existing =
      await WarAnimal.findOne({
        name: new RegExp(
          `^${escapeRegex(data.name)}$`,
          "i"
        ),
      });

    if (existing) {
      throw new ApiError(
        409,
        `War animal '${data.name}' already exists.`
      );
    }

    const animalId =
      await generateNextId(
        ID_PREFIXES.ANL
      );

    const warAnimal =
      await WarAnimal.create({
        ...data,
        animalId,
      });

    return warAnimal;
  }

  async getWarAnimals(
    query: WarAnimalQuery
  ) {
    await this.connect();

    const {
      page,
      limit,
      search,
      status,
      type,
      ownerId,
      kingdomId,
      armourId,
      memorialId,
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
        "breedSpecies",
        "specialAbilities",
        "tags",
      ])
    );

    if (status) {
      filter.status = status;
    }

    if (type) {
      filter.type = type;
    }

    if (ownerId) {
      filter.ownerId = ownerId;
    }

    if (kingdomId) {
      filter.kingdomId = kingdomId;
    }

    if (armourId) {
      filter.armourId = armourId;
    }

    if (memorialId) {
      filter.memorialId = memorialId;
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

    const [warAnimals, total] =
      await Promise.all([
        WarAnimal.find(filter)
          .sort(sortOption)
          .skip(skip)
          .limit(currentLimit),

        WarAnimal.countDocuments(
          filter
        ),
      ]);

    return {
      data: warAnimals,
      pagination:
        getPaginationMeta(
          currentPage,
          currentLimit,
          total
        ),
    };
  }

  async getWarAnimalById(
    animalId: string
  ) {
    await this.connect();

    return this.findByPublicIdOrThrow(
      WarAnimal,
      "animalId",
      animalId,
      "WarAnimal"
    );
  }

  async updateWarAnimal(
    animalId: string,
    data: UpdateWarAnimalInput
  ) {
    await this.connect();

    const warAnimal =
      await this.findByPublicIdOrThrow(
        WarAnimal,
        "animalId",
        animalId,
        "WarAnimal"
      );

    if (
      data.name &&
      data.name !== warAnimal.name
    ) {
      const existing =
        await WarAnimal.findOne({
          name: new RegExp(
            `^${escapeRegex(
              data.name
            )}$`,
            "i"
          ),
        });

      if (
        existing &&
        existing.animalId !== animalId
      ) {
        throw new ApiError(
          409,
          `War animal '${data.name}' already exists.`
        );
      }
    }

    Object.assign(
      warAnimal,
      data
    );

    await warAnimal.save();

    return warAnimal;
  }

  async deleteWarAnimal(
    animalId: string
  ) {
    await this.connect();

    const warAnimal =
      await this.findByPublicIdOrThrow(
        WarAnimal,
        "animalId",
        animalId,
        "WarAnimal"
      );

    await warAnimal.deleteOne();

    return {
      deleted: true,
      animalId,
    };
  }
}

export default new WarAnimalService();