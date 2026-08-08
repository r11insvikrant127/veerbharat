import { NextRequest, NextResponse } from "next/server";

import fortService from "@/services/fort.service";

import {
  createFortSchema,
  fortQuerySchema,
  fortIdSchema,
  updateFortSchema,
} from "@/validations/fort";

export default class FortController {
  static async create(request: NextRequest) {
    const body = await request.json();

    const data =
      createFortSchema.parse(body);

    const fort =
      await fortService.createFort(data);

    return NextResponse.json(fort);
  }

  static async getAll(request: NextRequest) {
    const query =
      Object.fromEntries(
        request.nextUrl.searchParams.entries()
      );

    const validatedQuery =
      fortQuerySchema.parse(query);

    const forts =
      await fortService.getForts(
        validatedQuery
      );

    return NextResponse.json(forts);
  }

  static async getById(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      fortIdSchema.parse(params);

    const fort =
      await fortService.getFortById(
        validated.id
      );

    return NextResponse.json(fort);
  }

  static async update(
    request: NextRequest,
    params: { id: string }
  ) {
    const validatedId =
      fortIdSchema.parse(params);

    const body =
      await request.json();

    const validatedBody =
      updateFortSchema.parse(body);

    const fort =
      await fortService.updateFort(
        validatedId.id,
        validatedBody
      );

    return NextResponse.json(fort);
  }

  static async delete(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      fortIdSchema.parse(params);

    const result =
      await fortService.deleteFort(
        validated.id
      );

    return NextResponse.json(result);
  }
}