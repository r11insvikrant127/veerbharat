import { NextRequest, NextResponse } from "next/server";

import historicalPersonalityService from "@/services/historicalPersonality.service";

import {
  createHistoricalPersonalitySchema,
  historicalPersonalityQuerySchema,
} from "@/validations/historicalPersonality";

export default class HistoricalPersonalityController {
  static async create(request: NextRequest) {
    const body = await request.json();

    const data =
      createHistoricalPersonalitySchema.parse(body);

    const historicalPersonality =
      await historicalPersonalityService.createHistoricalPersonality(
        data
      );

    return NextResponse.json(historicalPersonality);
  }

  static async getAll(request: NextRequest) {
    const query = Object.fromEntries(
      request.nextUrl.searchParams.entries()
    );

    const validatedQuery =
      historicalPersonalityQuerySchema.parse(query);

    const historicalPersonalities =
      await historicalPersonalityService.getHistoricalPersonalities(
        validatedQuery
      );

    return NextResponse.json(historicalPersonalities);
  }

  static async getById(
    _request: NextRequest,
    historicalPersonalityId: string
    ) {
    const historicalPersonality =
        await historicalPersonalityService.getHistoricalPersonalityById(
        historicalPersonalityId
        );

    if (!historicalPersonality) {
        return NextResponse.json(
        {
            error: "Historical personality not found",
        },
        {
            status: 404,
        }
        );
    }

    return NextResponse.json(historicalPersonality);
    }
}