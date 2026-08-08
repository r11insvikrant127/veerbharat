import { NextRequest, NextResponse } from "next/server";

import exhibitionService from "@/services/exhibition.service";

import {
  createExhibitionSchema,
  exhibitionQuerySchema,
  exhibitionIdSchema,
  updateExhibitionSchema,
} from "@/validations/exhibition";

export default class ExhibitionController {
  static async create(request: NextRequest) {
    const body = await request.json();

    const data =
      createExhibitionSchema.parse(body);

    const exhibition =
      await exhibitionService.createExhibition(data);

    return NextResponse.json(exhibition);
  }

  static async getAll(request: NextRequest) {
    const query =
      Object.fromEntries(
        request.nextUrl.searchParams.entries()
      );

    const validatedQuery =
      exhibitionQuerySchema.parse(query);

    const exhibitions =
      await exhibitionService.getExhibitions(
        validatedQuery
      );

    return NextResponse.json(exhibitions);
  }

  static async getById(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      exhibitionIdSchema.parse(params);

    const exhibition =
      await exhibitionService.getExhibitionById(
        validated.id
      );

    return NextResponse.json(exhibition);
  }

  static async update(
    request: NextRequest,
    params: { id: string }
  ) {
    const validatedId =
      exhibitionIdSchema.parse(params);

    const body =
      await request.json();

    const validatedBody =
      updateExhibitionSchema.parse(body);

    const exhibition =
      await exhibitionService.updateExhibition(
        validatedId.id,
        validatedBody
      );

    return NextResponse.json(exhibition);
  }

  static async delete(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      exhibitionIdSchema.parse(params);

    const result =
      await exhibitionService.deleteExhibition(
        validated.id
      );

    return NextResponse.json(result);
  }
}