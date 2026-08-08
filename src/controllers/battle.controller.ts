import { NextRequest, NextResponse } from "next/server";

import battleService from "@/services/battle.service";

import {
  createBattleSchema,
  battleQuerySchema,
  battleIdSchema,
  updateBattleSchema,
} from "@/validations/battle";

export default class BattleController {
  static async create(
    request: NextRequest
  ) {
    const body = await request.json();

    const data =
      createBattleSchema.parse(body);

    const battle =
      await battleService.createBattle(data);

    return NextResponse.json(battle);
  }

  static async getAll(
    request: NextRequest
  ) {
    const query =
      Object.fromEntries(
        request.nextUrl.searchParams.entries()
      );

    const validatedQuery =
      battleQuerySchema.parse(query);

    const battles =
      await battleService.getBattles(
        validatedQuery
      );

    return NextResponse.json(battles);
  }

  static async getById(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      battleIdSchema.parse(params);

    const battle =
      await battleService.getBattleById(
        validated.id
      );

    return NextResponse.json(battle);
  }

  static async update(
    request: NextRequest,
    params: { id: string }
  ) {
    const validatedId =
      battleIdSchema.parse(params);

    const body =
      await request.json();

    const validatedBody =
      updateBattleSchema.parse(body);

    const battle =
      await battleService.updateBattle(
        validatedId.id,
        validatedBody
      );

    return NextResponse.json(battle);
  }

  static async delete(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      battleIdSchema.parse(params);

    const result =
      await battleService.deleteBattle(
        validated.id
      );

    return NextResponse.json(result);
  }
}