// src/services/historicalPeriod.service.ts

import HistoricalPeriod from "@/models/historicalPeriod";
import ApiError from "@/lib/ApiError";
import BaseService from "./base.service";
import { getSearchRegex } from "@/helpers/search";
import { getPagination } from "@/helpers/pagination";
import { getSort } from "@/helpers/sorting";
import { escapeRegex } from "@/helpers/search";

import {
  CreateHistoricalPeriodInput,
  HistoricalPeriodQuery,
  UpdateHistoricalPeriodInput,
} from "@/validations/historicalPeriod";

import { generateNextId } from "@/services/idGenerator.service";
import { ID_PREFIXES } from "@/constants";

class HistoricalPeriodService extends BaseService {
    async createHistoricalPeriod(
    data: CreateHistoricalPeriodInput
    ) {
    // Ensure database connection
    await this.connect();

    // Check for duplicate name (case-insensitive)
    const existingPeriod = await HistoricalPeriod.findOne({
    name: new RegExp(
        `^${escapeRegex(data.name)}$`,
        "i"
    ),
    });

    if (existingPeriod) {
        throw new ApiError(
        409,
        `Historical Period '${data.name}' already exists.`
        );
    }

    // Generate unique period ID
    const periodId = await generateNextId(ID_PREFIXES.PER);

    // Create the document
    const historicalPeriod =
        await HistoricalPeriod.create({
        ...data,
        periodId,
        });

    return historicalPeriod;
    }

    async getHistoricalPeriods(
    query: HistoricalPeriodQuery
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

    const [periods, total] = await Promise.all([
        HistoricalPeriod.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(currentLimit),

        HistoricalPeriod.countDocuments(filter),
    ]);

    return {
        data: periods,
        pagination: {
        page: currentPage,
        limit: currentLimit,
        total,
        totalPages: Math.ceil(total / currentLimit),
        },
    };
    }

    private async findPeriodOrThrow(
    periodId: string
    ) {
    const historicalPeriod =
        await HistoricalPeriod.findOne({
        periodId,
        });

    if (!historicalPeriod) {
        throw new ApiError(
        404,
        "Historical Period not found."
        );
    }

    return historicalPeriod;
    }

    async getHistoricalPeriodById(
    periodId: string
    ) {
    await this.connect();

    return this.findPeriodOrThrow(periodId);
    }
   
    async updateHistoricalPeriod(
    periodId: string,
    data: UpdateHistoricalPeriodInput
    ) {
    await this.connect();

    const historicalPeriod =
        await this.findPeriodOrThrow(periodId);

    Object.assign(
        historicalPeriod,
        data
    );

    await historicalPeriod.save();

    return historicalPeriod;
    }

    async deleteHistoricalPeriod(
    periodId: string
    ) {
    await this.connect();

    const historicalPeriod =
        await this.findPeriodOrThrow(periodId);

    await historicalPeriod.deleteOne();

    return {
        deleted: true,
        periodId,
    };
    }
}

export default new HistoricalPeriodService();