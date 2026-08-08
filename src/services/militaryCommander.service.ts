import MilitaryCommander from "@/models/militaryCommander";
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
  CreateMilitaryCommanderInput,
  UpdateMilitaryCommanderInput,
  MilitaryCommanderQuery,
} from "@/validations/militaryCommander";

import { generateNextId } from "@/services/idGenerator.service";
import { ID_PREFIXES } from "@/constants";

class MilitaryCommanderService extends BaseService {
  async createMilitaryCommander(
    data: CreateMilitaryCommanderInput
  ) {
    await this.connect();

    const existing =
      await MilitaryCommander.findOne({
        name: new RegExp(
          `^${escapeRegex(data.name)}$`,
          "i"
        ),
      });

    if (existing) {
      throw new ApiError(
        409,
        `Military commander '${data.name}' already exists.`
      );
    }

    const commanderId =
      await generateNextId(
        ID_PREFIXES.MCO
      );

    const commander =
      await MilitaryCommander.create({
        ...data,
        commanderId,
      });

    return commander;
  }

  async getMilitaryCommanders(
    query: MilitaryCommanderQuery
  ) {
    await this.connect();

    const {
      page,
      limit,
      search,
      status,
      role,
      kingdomId,
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
        "title",
        "allegiance",
        "tags",
      ])
    );

    if (status) {
      filter.status = status;
    }

    if (role) {
      filter.role = role;
    }

    if (kingdomId) {
      filter.kingdomId = kingdomId;
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

    const [
      commanders,
      total,
    ] = await Promise.all([
      MilitaryCommander.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(currentLimit),

      MilitaryCommander.countDocuments(
        filter
      ),
    ]);

    return {
      data: commanders,
      pagination:
        getPaginationMeta(
          currentPage,
          currentLimit,
          total
        ),
    };
  }

  async getMilitaryCommanderById(
    commanderId: string
  ) {
    await this.connect();

    return this.findByPublicIdOrThrow(
      MilitaryCommander,
      "commanderId",
      commanderId,
      "MilitaryCommander"
    );
  }

  async updateMilitaryCommander(
    commanderId: string,
    data: UpdateMilitaryCommanderInput
  ) {
    await this.connect();

    const commander =
      await this.findByPublicIdOrThrow(
        MilitaryCommander,
        "commanderId",
        commanderId,
        "MilitaryCommander"
      );

    if (
      data.name &&
      data.name !== commander.name
    ) {
      const existing =
        await MilitaryCommander.findOne({
          name: new RegExp(
            `^${escapeRegex(
              data.name
            )}$`,
            "i"
          ),
        });

      if (
        existing &&
        existing.commanderId !==
          commanderId
      ) {
        throw new ApiError(
          409,
          `Military commander '${data.name}' already exists.`
        );
      }
    }

    Object.assign(
      commander,
      data
    );

    await commander.save();

    return commander;
  }

  async deleteMilitaryCommander(
    commanderId: string
  ) {
    await this.connect();

    const commander =
      await this.findByPublicIdOrThrow(
        MilitaryCommander,
        "commanderId",
        commanderId,
        "MilitaryCommander"
      );

    await commander.deleteOne();

    return {
      deleted: true,
      commanderId,
    };
  }
}

export default new MilitaryCommanderService();