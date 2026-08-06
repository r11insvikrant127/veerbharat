// src/controllers/historicalPeriod.controller.ts

import { NextRequest } from "next/server";

import historicalPeriodService
from "@/services/historicalPeriod.service";

import {
  createHistoricalPeriodSchema,
  historicalPeriodQuerySchema,  
  historicalPeriodIdSchema,
  updateHistoricalPeriodSchema,
} from "@/validations/historicalPeriod";

export default class HistoricalPeriodController {

  static async create(
    request: NextRequest
  ) {

    const body = await request.json();

    const data =
      createHistoricalPeriodSchema.parse(body);

    return historicalPeriodService
      .createHistoricalPeriod(data);

  }

  static async getAll(
    request: NextRequest
  ) {

    const query =
      Object.fromEntries(
        request.nextUrl.searchParams.entries()
      );

    const validatedQuery =
      historicalPeriodQuerySchema.parse(query);

    return historicalPeriodService
      .getHistoricalPeriods(validatedQuery);

  }

  static async getById(
    request: NextRequest,
    params: { id: string }
    ) {
    const validated =
        historicalPeriodIdSchema.parse(params);

    return historicalPeriodService
        .getHistoricalPeriodById(validated.id);
    }

    static async update(
    request: NextRequest,
    params: { id: string }
    ) {
    const validatedId =
        historicalPeriodIdSchema.parse(params);

    const body = await request.json();

    const validatedBody =
        updateHistoricalPeriodSchema.parse(body);

    return historicalPeriodService.updateHistoricalPeriod(
        validatedId.id,
        validatedBody
    );
    }

    static async delete(
    request: NextRequest,
    params: { id: string }
    ) {
    const validated =
        historicalPeriodIdSchema.parse(params);

    return historicalPeriodService.deleteHistoricalPeriod(
        validated.id
    );
    }

}