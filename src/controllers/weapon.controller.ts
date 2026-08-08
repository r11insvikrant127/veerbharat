import { NextRequest, NextResponse } from "next/server";

import weaponService from "@/services/weapon.service";

import {
  createWeaponSchema,
  weaponQuerySchema,
  weaponIdSchema,
  updateWeaponSchema,
} from "@/validations/weapon";

export default class WeaponController {
  static async create(request: NextRequest) {
    const body = await request.json();

    const data =
      createWeaponSchema.parse(body);

    const weapon =
      await weaponService.createWeapon(data);

    return NextResponse.json(weapon);
  }

  static async getAll(request: NextRequest) {
    const query =
      Object.fromEntries(
        request.nextUrl.searchParams.entries()
      );

    const validatedQuery =
      weaponQuerySchema.parse(query);

    const weapons =
      await weaponService.getWeapons(
        validatedQuery
      );

    return NextResponse.json(weapons);
  }

  static async getById(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      weaponIdSchema.parse(params);

    const weapon =
      await weaponService.getWeaponById(
        validated.id
      );

    return NextResponse.json(weapon);
  }

  static async update(
    request: NextRequest,
    params: { id: string }
  ) {
    const validatedId =
      weaponIdSchema.parse(params);

    const body =
      await request.json();

    const validatedBody =
      updateWeaponSchema.parse(body);

    const weapon =
      await weaponService.updateWeapon(
        validatedId.id,
        validatedBody
      );

    return NextResponse.json(weapon);
  }

  static async delete(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      weaponIdSchema.parse(params);

    const result =
      await weaponService.deleteWeapon(
        validated.id
      );

    return NextResponse.json(result);
  }
}