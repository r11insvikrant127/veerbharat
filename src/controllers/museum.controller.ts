import { NextRequest, NextResponse } from "next/server";

import museumService from "@/services/museum.service";

import {
  createMuseumSchema,
  museumQuerySchema,
  museumIdSchema,
  updateMuseumSchema,
} from "@/validations/museum";

export default class MuseumController {
  static async create(request: NextRequest) {
    const body = await request.json();

    const data =
      createMuseumSchema.parse(body);

    const museum =
      await museumService.createMuseum(data);

    return NextResponse.json(museum);
  }

  static async getAll(request: NextRequest) {
    const query =
      Object.fromEntries(
        request.nextUrl.searchParams.entries()
      );

    const validatedQuery =
      museumQuerySchema.parse(query);

    const museums =
      await museumService.getMuseums(
        validatedQuery
      );

    return NextResponse.json(museums);
  }

  static async getById(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      museumIdSchema.parse(params);

    const museum =
      await museumService.getMuseumById(
        validated.id
      );

    return NextResponse.json(museum);
  }

  static async update(
    request: NextRequest,
    params: { id: string }
  ) {
    const validatedId =
      museumIdSchema.parse(params);

    const body =
      await request.json();

    const validatedBody =
      updateMuseumSchema.parse(body);

    const museum =
      await museumService.updateMuseum(
        validatedId.id,
        validatedBody
      );

    return NextResponse.json(museum);
  }

  static async delete(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      museumIdSchema.parse(params);

    const result =
      await museumService.deleteMuseum(
        validated.id
      );

    return NextResponse.json(result);
  }
}