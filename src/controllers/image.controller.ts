import { NextRequest, NextResponse } from "next/server";

import imageService from "@/services/image.service";

import {
  createImageSchema,
  imageQuerySchema,
  imageIdSchema,
  updateImageSchema,
} from "@/validations/image";

export default class ImageController {
  static async create(request: NextRequest) {
    const body = await request.json();

    const data =
      createImageSchema.parse(body);

    const image =
      await imageService.createImage(data);

    return NextResponse.json(image);
  }

  static async getAll(request: NextRequest) {
    const query =
      Object.fromEntries(
        request.nextUrl.searchParams.entries()
      );

    const validatedQuery =
      imageQuerySchema.parse(query);

    const images =
      await imageService.getImages(
        validatedQuery
      );

    return NextResponse.json(images);
  }

  static async getById(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      imageIdSchema.parse(params);

    const image =
      await imageService.getImageById(
        validated.id
      );

    return NextResponse.json(image);
  }

  static async update(
    request: NextRequest,
    params: { id: string }
  ) {
    const validatedId =
      imageIdSchema.parse(params);

    const body =
      await request.json();

    const validatedBody =
      updateImageSchema.parse(body);

    const image =
      await imageService.updateImage(
        validatedId.id,
        validatedBody
      );

    return NextResponse.json(image);
  }

  static async delete(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      imageIdSchema.parse(params);

    const result =
      await imageService.deleteImage(
        validated.id
      );

    return NextResponse.json(result);
  }
}