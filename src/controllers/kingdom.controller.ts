// src/controllers/kingdom.controller.ts

import { NextRequest, NextResponse } from "next/server";

import kingdomService from "@/services/kingdom.service";

import {
  createKingdomSchema,
  updateKingdomSchema,
  kingdomQuerySchema,
  kingdomIdSchema,
} from "@/validations/kingdom";

export default class KingdomController {
  static async create(request: NextRequest) {
    const body = await request.json();

    const data =
      createKingdomSchema.parse(body);

    const kingdom =
      await kingdomService.createKingdom(data);

    return NextResponse.json(kingdom);
  }

  static async getAll(request: NextRequest) {
    const query = Object.fromEntries(
      request.nextUrl.searchParams.entries()
    );

    const validatedQuery =
      kingdomQuerySchema.parse(query);

    const kingdoms =
      await kingdomService.getKingdoms(validatedQuery);

    return NextResponse.json(kingdoms);
  }

  static async getById(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      kingdomIdSchema.parse(params);

    const kingdom =
      await kingdomService.getKingdomById(
        validated.id
      );

    return NextResponse.json(kingdom);
  }

  static async update(
    request: NextRequest,
    params: { id: string }
  ) {
    const validatedId =
      kingdomIdSchema.parse(params);

    const body = await request.json();

    const validatedBody =
      updateKingdomSchema.parse(body);

    const kingdom =
      await kingdomService.updateKingdom(
        validatedId.id,
        validatedBody
      );

    return NextResponse.json(kingdom);
  }

  static async delete(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      kingdomIdSchema.parse(params);

    const result =
      await kingdomService.deleteKingdom(
        validated.id
      );

    return NextResponse.json(result);
  }
}