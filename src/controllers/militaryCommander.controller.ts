import { NextRequest, NextResponse } from "next/server";

import militaryCommanderService from "@/services/militaryCommander.service";

import {
  createMilitaryCommanderSchema,
  militaryCommanderQuerySchema,
  militaryCommanderIdSchema,
  updateMilitaryCommanderSchema,
} from "@/validations/militaryCommander";

export default class MilitaryCommanderController {
  static async create(request: NextRequest) {
    const body = await request.json();

    const data =
      createMilitaryCommanderSchema.parse(body);

    const commander =
      await militaryCommanderService.createMilitaryCommander(
        data
      );

    return NextResponse.json(commander);
  }

  static async getAll(request: NextRequest) {
    const query =
      Object.fromEntries(
        request.nextUrl.searchParams.entries()
      );

    const validatedQuery =
      militaryCommanderQuerySchema.parse(query);

    const commanders =
      await militaryCommanderService.getMilitaryCommanders(
        validatedQuery
      );

    return NextResponse.json(commanders);
  }

  static async getById(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      militaryCommanderIdSchema.parse(params);

    const commander =
      await militaryCommanderService.getMilitaryCommanderById(
        validated.id
      );

    return NextResponse.json(commander);
  }

  static async update(
    request: NextRequest,
    params: { id: string }
  ) {
    const validatedId =
      militaryCommanderIdSchema.parse(params);

    const body =
      await request.json();

    const validatedBody =
      updateMilitaryCommanderSchema.parse(body);

    const commander =
      await militaryCommanderService.updateMilitaryCommander(
        validatedId.id,
        validatedBody
      );

    return NextResponse.json(commander);
  }

  static async delete(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      militaryCommanderIdSchema.parse(params);

    const result =
      await militaryCommanderService.deleteMilitaryCommander(
        validated.id
      );

    return NextResponse.json(result);
  }
}