import Weapon from "@/models/weapon";
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
  CreateWeaponInput,
  UpdateWeaponInput,
  WeaponQuery,
} from "@/validations/weapon";

import { generateNextId } from "@/services/idGenerator.service";
import { ID_PREFIXES } from "@/constants";

class WeaponService extends BaseService {
  async createWeapon(
    data: CreateWeaponInput
  ) {
    await this.connect();

    const existing =
      await Weapon.findOne({
        name: new RegExp(
          `^${escapeRegex(data.name)}$`,
          "i"
        ),
      });

    if (existing) {
      throw new ApiError(
        409,
        `Weapon '${data.name}' already exists.`
      );
    }

    const weaponId =
      await generateNextId(
        ID_PREFIXES.WPN
      );

    const weapon =
      await Weapon.create({
        ...data,
        weaponId,
      });

    return weapon;
  }

  async getWeapons(
    query: WeaponQuery
  ) {
    await this.connect();

    const {
      page,
      limit,
      search,
      status,
      category,
      eraUsed,
      replicaExists,
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
        "specialFeatures",
        "tags",
      ])
    );

    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (eraUsed) {
      filter.eraUsed = eraUsed;
    }

    if (
      replicaExists !== undefined
    ) {
      filter.replicaExists =
        replicaExists;
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

    const [weapons, total] =
      await Promise.all([
        Weapon.find(filter)
          .sort(sortOption)
          .skip(skip)
          .limit(currentLimit),

        Weapon.countDocuments(
          filter
        ),
      ]);

    return {
      data: weapons,
      pagination:
        getPaginationMeta(
          currentPage,
          currentLimit,
          total
        ),
    };
  }

  async getWeaponById(
    weaponId: string
  ) {
    await this.connect();

    return this.findByPublicIdOrThrow(
      Weapon,
      "weaponId",
      weaponId,
      "Weapon"
    );
  }

  async updateWeapon(
    weaponId: string,
    data: UpdateWeaponInput
  ) {
    await this.connect();

    const weapon =
      await this.findByPublicIdOrThrow(
        Weapon,
        "weaponId",
        weaponId,
        "Weapon"
      );

    if (
      data.name &&
      data.name !== weapon.name
    ) {
      const existing =
        await Weapon.findOne({
          name: new RegExp(
            `^${escapeRegex(
              data.name
            )}$`,
            "i"
          ),
        });

      if (
        existing &&
        existing.weaponId !==
          weaponId
      ) {
        throw new ApiError(
          409,
          `Weapon '${data.name}' already exists.`
        );
      }
    }

    Object.assign(
      weapon,
      data
    );

    await weapon.save();

    return weapon;
  }

  async deleteWeapon(
    weaponId: string
  ) {
    await this.connect();

    const weapon =
      await this.findByPublicIdOrThrow(
        Weapon,
        "weaponId",
        weaponId,
        "Weapon"
      );

    await weapon.deleteOne();

    return {
      deleted: true,
      weaponId,
    };
  }
}

export default new WeaponService();