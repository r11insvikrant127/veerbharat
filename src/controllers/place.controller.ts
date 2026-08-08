import { NextRequest, NextResponse } from "next/server";

import placeService from "@/services/place.service";

import {
  createPlaceSchema,
  placeQuerySchema,
  placeIdSchema,
  updatePlaceSchema,
} from "@/validations/place";

export default class PlaceController {
  static async create(request: NextRequest) {
    const body = await request.json();

    const data = createPlaceSchema.parse(body);

    const place =
      await placeService.createPlace(data);

    return NextResponse.json(place);
  }

  static async getAll(request: NextRequest) {
    const query = Object.fromEntries(
      request.nextUrl.searchParams.entries()
    );

    const validatedQuery =
      placeQuerySchema.parse(query);

    const places =
      await placeService.getPlaces(validatedQuery);

    return NextResponse.json(places);
  }

  static async getById(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      placeIdSchema.parse(params);

    const place =
      await placeService.getPlaceById(
        validated.id
      );

    return NextResponse.json(place);
  }

  static async update(
    request: NextRequest,
    params: { id: string }
  ) {
    const validatedId =
      placeIdSchema.parse(params);

    const body = await request.json();

    const validatedBody =
      updatePlaceSchema.parse(body);

    const place =
      await placeService.updatePlace(
        validatedId.id,
        validatedBody
      );

    return NextResponse.json(place);
  }

  static async delete(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      placeIdSchema.parse(params);

    const result =
      await placeService.deletePlace(
        validated.id
      );

    return NextResponse.json(result);
  }
}