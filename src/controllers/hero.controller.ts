import { NextRequest } from "next/server";

import heroService
from "@/services/hero.service";

import { NextResponse } from "next/server";

import {
  createHeroSchema,
  heroQuerySchema,
  heroIdSchema,
  updateHeroSchema,
} from "@/validations/hero";

export default class HeroController {

  static async create(
    request: NextRequest
  ) {

    const body = await request.json();

    const data =
      createHeroSchema.parse(body);

    const hero =
    await heroService.createHero(data);

    return NextResponse.json(hero);
  }

  static async getAll(
    request: NextRequest
  ) {

    const query =
      Object.fromEntries(
        request.nextUrl.searchParams.entries()
      );

    const validatedQuery =
      heroQuerySchema.parse(query);

    const heroes =
    await heroService.getHeroes(validatedQuery);

    return NextResponse.json(heroes);
  }

  static async getById(
    request: NextRequest,
    params: { id: string }
  ) {

    const validated =
      heroIdSchema.parse(params);

    const hero =
    await heroService.getHeroById(validated.id);

    return NextResponse.json(hero);
  }

  static async update(
    request: NextRequest,
    params: { id: string }
  ) {

    const validatedId =
      heroIdSchema.parse(params);

    const body =
      await request.json();

    const validatedBody =
      updateHeroSchema.parse(body);

    const hero =
    await heroService.updateHero(
        validatedId.id,
        validatedBody
    );

    return NextResponse.json(hero);
  }

  static async delete(
    request: NextRequest,
    params: { id: string }
  ) {

    const validated =
      heroIdSchema.parse(params);

    const result =
    await heroService.deleteHero(
        validated.id
    );

    return NextResponse.json(result);
  }

}