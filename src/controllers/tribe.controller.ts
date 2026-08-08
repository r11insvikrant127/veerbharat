import { NextRequest, NextResponse } from "next/server";

import tribeService from "@/services/tribe.service";

import {
  createTribeSchema,
  tribeQuerySchema,
  tribeIdSchema,
  updateTribeSchema,
} from "@/validations/tribe";

export default class TribeController {
  static async create(request: NextRequest) {
    const body = await request.json();

    const data =
      createTribeSchema.parse(body);

    const tribe =
      await tribeService.createTribe(data);

    return NextResponse.json(tribe);
  }

  static async getAll(request: NextRequest) {
    const query =
      Object.fromEntries(
        request.nextUrl.searchParams.entries()
      );

    const validatedQuery =
      tribeQuerySchema.parse(query);

    const tribes =
      await tribeService.getTribes(
        validatedQuery
      );

    return NextResponse.json(tribes);
  }

  static async getById(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      tribeIdSchema.parse(params);

    const tribe =
      await tribeService.getTribeById(
        validated.id
      );

    return NextResponse.json(tribe);
  }

  static async update(
    request: NextRequest,
    params: { id: string }
  ) {
    const validatedId =
      tribeIdSchema.parse(params);

    const body =
      await request.json();

    const validatedBody =
      updateTribeSchema.parse(body);

    const tribe =
      await tribeService.updateTribe(
        validatedId.id,
        validatedBody
      );

    return NextResponse.json(tribe);
  }

  static async delete(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      tribeIdSchema.parse(params);

    const result =
      await tribeService.deleteTribe(
        validated.id
      );

    return NextResponse.json(result);
  }
}