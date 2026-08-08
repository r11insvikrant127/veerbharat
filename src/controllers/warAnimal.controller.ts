import { NextRequest, NextResponse } from "next/server";

import warAnimalService from "@/services/warAnimal.service";

import {
  createWarAnimalSchema,
  warAnimalQuerySchema,
  warAnimalIdSchema,
  updateWarAnimalSchema,
} from "@/validations/warAnimal";

export default class WarAnimalController {
  static async create(request: NextRequest) {
    const body = await request.json();

    const data =
      createWarAnimalSchema.parse(body);

    const warAnimal =
      await warAnimalService.createWarAnimal(data);

    return NextResponse.json(warAnimal);
  }

  static async getAll(request: NextRequest) {
    const query =
      Object.fromEntries(
        request.nextUrl.searchParams.entries()
      );

    const validatedQuery =
      warAnimalQuerySchema.parse(query);

    const warAnimals =
      await warAnimalService.getWarAnimals(
        validatedQuery
      );

    return NextResponse.json(warAnimals);
  }

  static async getById(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      warAnimalIdSchema.parse(params);

    const warAnimal =
      await warAnimalService.getWarAnimalById(
        validated.id
      );

    return NextResponse.json(warAnimal);
  }

  static async update(
    request: NextRequest,
    params: { id: string }
  ) {
    const validatedId =
      warAnimalIdSchema.parse(params);

    const body =
      await request.json();

    const validatedBody =
      updateWarAnimalSchema.parse(body);

    const warAnimal =
      await warAnimalService.updateWarAnimal(
        validatedId.id,
        validatedBody
      );

    return NextResponse.json(warAnimal);
  }

  static async delete(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      warAnimalIdSchema.parse(params);

    const result =
      await warAnimalService.deleteWarAnimal(
        validated.id
      );

    return NextResponse.json(result);
  }
}