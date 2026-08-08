// src/controllers/historicalPeriod.controller.ts

import { NextRequest,NextResponse } from "next/server";

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

    const historicalPeriod =
    await historicalPeriodService.createHistoricalPeriod(data);

    return NextResponse.json(historicalPeriod);

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

    const historicalPeriods =
    await historicalPeriodService.getHistoricalPeriods(validatedQuery);

    return NextResponse.json(historicalPeriods);

  }

  static async getById(
    request: NextRequest,
    params: { id: string }
    ) {
    const validated =
        historicalPeriodIdSchema.parse(params);

    const historicalPeriod =
    await historicalPeriodService.getHistoricalPeriodById(validated.id);

    return NextResponse.json(historicalPeriod);
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

    const historicalPeriod =
    await historicalPeriodService.updateHistoricalPeriod(
      validatedId.id,
      validatedBody
    );

    return NextResponse.json(historicalPeriod);
    }

    static async delete(
    request: NextRequest,
    params: { id: string }
    ) {
    const validated =
        historicalPeriodIdSchema.parse(params);

    const result =
    await historicalPeriodService.deleteHistoricalPeriod(
      validated.id
    );

    return NextResponse.json(result);
    }

}