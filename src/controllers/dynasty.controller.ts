import { NextRequest, NextResponse } from "next/server";

import dynastyService from "@/services/dynasty.service";

import {
  createDynastySchema,
  dynastyQuerySchema,
  dynastyIdSchema,
  updateDynastySchema,
} from "@/validations/dynasty";

export default class DynastyController {
  static async create(
    request: NextRequest
  ) {
    const body = await request.json();

    const data =
      createDynastySchema.parse(body);

    const dynasty =
      await dynastyService.createDynasty(data);

    return NextResponse.json(dynasty);
  }

  static async getAll(
    request: NextRequest
  ) {
    const query =
      Object.fromEntries(
        request.nextUrl.searchParams.entries()
      );

    const validatedQuery =
      dynastyQuerySchema.parse(query);

    const dynasties =
      await dynastyService.getDynasties(
        validatedQuery
      );

    return NextResponse.json(dynasties);
  }

  static async getById(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      dynastyIdSchema.parse(params);

    const dynasty =
      await dynastyService.getDynastyById(
        validated.id
      );

    return NextResponse.json(dynasty);
  }

  static async update(
    request: NextRequest,
    params: { id: string }
  ) {
    const validatedId =
      dynastyIdSchema.parse(params);

    const body =
      await request.json();

    const validatedBody =
      updateDynastySchema.parse(body);

    const dynasty =
      await dynastyService.updateDynasty(
        validatedId.id,
        validatedBody
      );

    return NextResponse.json(dynasty);
  }

  static async delete(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      dynastyIdSchema.parse(params);

    const result =
      await dynastyService.deleteDynasty(
        validated.id
      );

    return NextResponse.json(result);
  }
}