// src/services/historicalPeriod.service.ts

import HistoricalPeriod from "@/models/historicalPeriod";
import ApiError from "@/lib/ApiError";
import BaseService from "./base.service";

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
        name: {
        $regex: new RegExp(`^${data.name}$`, "i"),
        },
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
    if (search) {
        filter.name = {
        $regex: search,
        $options: "i",
        };
    }

    // Filter by status
    if (status) {
        filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [periods, total] = await Promise.all([
        HistoricalPeriod.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit),

        HistoricalPeriod.countDocuments(filter),
    ]);

    return {
        data: periods,
        pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
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