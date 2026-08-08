import { NextRequest, NextResponse } from "next/server";

import allianceService from "@/services/alliance.service";

import {
  createAllianceSchema,
  allianceQuerySchema,
  allianceIdSchema,
  updateAllianceSchema,
} from "@/validations/alliance";

export default class AllianceController {
  static async create(request: NextRequest) {
    const body = await request.json();

    const data =
      createAllianceSchema.parse(body);

    const alliance =
      await allianceService.createAlliance(data);

    return NextResponse.json(alliance);
  }

  static async getAll(request: NextRequest) {
    const query =
      Object.fromEntries(
        request.nextUrl.searchParams.entries()
      );

    const validatedQuery =
      allianceQuerySchema.parse(query);

    const alliances =
      await allianceService.getAlliances(
        validatedQuery
      );

    return NextResponse.json(alliances);
  }

  static async getById(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      allianceIdSchema.parse(params);

    const alliance =
      await allianceService.getAllianceById(
        validated.id
      );

    return NextResponse.json(alliance);
  }

  static async update(
    request: NextRequest,
    params: { id: string }
  ) {
    const validatedId =
      allianceIdSchema.parse(params);

    const body =
      await request.json();

    const validatedBody =
      updateAllianceSchema.parse(body);

    const alliance =
      await allianceService.updateAlliance(
        validatedId.id,
        validatedBody
      );

    return NextResponse.json(alliance);
  }

  static async delete(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      allianceIdSchema.parse(params);

    const result =
      await allianceService.deleteAlliance(
        validated.id
      );

    return NextResponse.json(result);
  }
}