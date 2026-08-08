import { NextRequest, NextResponse } from "next/server";

import sourceService from "@/services/source.service";

import {
  createSourceSchema,
  sourceQuerySchema,
  sourceIdSchema,
  updateSourceSchema,
} from "@/validations/source";

export default class SourceController {
  static async create(
    request: NextRequest
  ) {
    const body = await request.json();

    const data =
      createSourceSchema.parse(body);

    const source =
      await sourceService.createSource(data);

    return NextResponse.json(source);
  }

  static async getAll(
    request: NextRequest
  ) {
    const query =
      Object.fromEntries(
        request.nextUrl.searchParams.entries()
      );

    const validatedQuery =
      sourceQuerySchema.parse(query);

    const sources =
      await sourceService.getSources(
        validatedQuery
      );

    return NextResponse.json(sources);
  }

  static async getById(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      sourceIdSchema.parse(params);

    const source =
      await sourceService.getSourceById(
        validated.id
      );

    return NextResponse.json(source);
  }

  static async update(
    request: NextRequest,
    params: { id: string }
  ) {
    const validatedId =
      sourceIdSchema.parse(params);

    const body =
      await request.json();

    const validatedBody =
      updateSourceSchema.parse(body);

    const source =
      await sourceService.updateSource(
        validatedId.id,
        validatedBody
      );

    return NextResponse.json(source);
  }

  static async delete(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      sourceIdSchema.parse(params);

    const result =
      await sourceService.deleteSource(
        validated.id
      );

    return NextResponse.json(result);
  }
}