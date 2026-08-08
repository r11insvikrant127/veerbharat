import { NextRequest, NextResponse } from "next/server";

import memorialService from "@/services/memorial.service";

import {
  createMemorialSchema,
  memorialQuerySchema,
  memorialIdSchema,
  updateMemorialSchema,
} from "@/validations/memorial";

export default class MemorialController {
  static async create(request: NextRequest) {
    const body = await request.json();

    const data =
      createMemorialSchema.parse(body);

    const memorial =
      await memorialService.createMemorial(data);

    return NextResponse.json(memorial);
  }

  static async getAll(request: NextRequest) {
    const query =
      Object.fromEntries(
        request.nextUrl.searchParams.entries()
      );

    const validatedQuery =
      memorialQuerySchema.parse(query);

    const memorials =
      await memorialService.getMemorials(
        validatedQuery
      );

    return NextResponse.json(memorials);
  }

  static async getById(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      memorialIdSchema.parse(params);

    const memorial =
      await memorialService.getMemorialById(
        validated.id
      );

    return NextResponse.json(memorial);
  }

  static async update(
    request: NextRequest,
    params: { id: string }
  ) {
    const validatedId =
      memorialIdSchema.parse(params);

    const body =
      await request.json();

    const validatedBody =
      updateMemorialSchema.parse(body);

    const memorial =
      await memorialService.updateMemorial(
        validatedId.id,
        validatedBody
      );

    return NextResponse.json(memorial);
  }

  static async delete(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      memorialIdSchema.parse(params);

    const result =
      await memorialService.deleteMemorial(
        validated.id
      );

    return NextResponse.json(result);
  }
}