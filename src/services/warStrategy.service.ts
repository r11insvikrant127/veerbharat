import WarStrategy from "@/models/warStrategy";
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
  CreateWarStrategyInput,
  UpdateWarStrategyInput,
  WarStrategyQuery,
} from "@/validations/warStrategy";

import { generateNextId } from "@/services/idGenerator.service";
import { ID_PREFIXES } from "@/constants";

class WarStrategyService extends BaseService {
  async createWarStrategy(
    data: CreateWarStrategyInput
  ) {
    await this.connect();

    const existing =
      await WarStrategy.findOne({
        name: new RegExp(
          `^${escapeRegex(data.name)}$`,
          "i"
        ),
      });

    if (existing) {
      throw new ApiError(
        409,
        `War strategy '${data.name}' already exists.`
      );
    }

    const strategyId =
      await generateNextId(
        ID_PREFIXES.WST
      );

    const strategy =
      await WarStrategy.create({
        ...data,
        strategyId,
      });

    return strategy;
  }

  async getWarStrategies(
    query: WarStrategyQuery
  ) {
    await this.connect();

    const {
      page,
      limit,
      search,
      status,
      type,
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
        "keyPrinciples",
        "tags",
      ])
    );

    if (status) {
      filter.status = status;
    }

    if (type) {
      filter.type = type;
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
      strategies,
      total,
    ] = await Promise.all([
      WarStrategy.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(currentLimit),

      WarStrategy.countDocuments(
        filter
      ),
    ]);

    return {
      data: strategies,
      pagination:
        getPaginationMeta(
          currentPage,
          currentLimit,
          total
        ),
    };
  }

  async getWarStrategyById(
    strategyId: string
  ) {
    await this.connect();

    return this.findByPublicIdOrThrow(
      WarStrategy,
      "strategyId",
      strategyId,
      "WarStrategy"
    );
  }

  async updateWarStrategy(
    strategyId: string,
    data: UpdateWarStrategyInput
  ) {
    await this.connect();

    const strategy =
      await this.findByPublicIdOrThrow(
        WarStrategy,
        "strategyId",
        strategyId,
        "WarStrategy"
      );

    if (
      data.name &&
      data.name !== strategy.name
    ) {
      const existing =
        await WarStrategy.findOne({
          name: new RegExp(
            `^${escapeRegex(
              data.name
            )}$`,
            "i"
          ),
        });

      if (
        existing &&
        existing.strategyId !==
          strategyId
      ) {
        throw new ApiError(
          409,
          `War strategy '${data.name}' already exists.`
        );
      }
    }

    Object.assign(
      strategy,
      data
    );

    await strategy.save();

    return strategy;
  }

  async deleteWarStrategy(
    strategyId: string
  ) {
    await this.connect();

    const strategy =
      await this.findByPublicIdOrThrow(
        WarStrategy,
        "strategyId",
        strategyId,
        "WarStrategy"
      );

    await strategy.deleteOne();

    return {
      deleted: true,
      strategyId,
    };
  }
}

const WarStrategyServiceInstance = new WarStrategyService();

export default WarStrategyServiceInstance;
