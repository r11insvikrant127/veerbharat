import { NextRequest, NextResponse } from "next/server";

import warStrategyService from "@/services/warStrategy.service";

import {
  createWarStrategySchema,
  warStrategyQuerySchema,
  warStrategyIdSchema,
  updateWarStrategySchema,
} from "@/validations/warStrategy";

export default class WarStrategyController {
  static async create(request: NextRequest) {
    const body = await request.json();

    const data =
      createWarStrategySchema.parse(body);

    const strategy =
      await warStrategyService.createWarStrategy(data);

    return NextResponse.json(strategy);
  }

  static async getAll(request: NextRequest) {
    const query =
      Object.fromEntries(
        request.nextUrl.searchParams.entries()
      );

    const validatedQuery =
      warStrategyQuerySchema.parse(query);

    const strategies =
      await warStrategyService.getWarStrategies(
        validatedQuery
      );

    return NextResponse.json(strategies);
  }

  static async getById(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      warStrategyIdSchema.parse(params);

    const strategy =
      await warStrategyService.getWarStrategyById(
        validated.id
      );

    return NextResponse.json(strategy);
  }

  static async update(
    request: NextRequest,
    params: { id: string }
  ) {
    const validatedId =
      warStrategyIdSchema.parse(params);

    const body =
      await request.json();

    const validatedBody =
      updateWarStrategySchema.parse(body);

    const strategy =
      await warStrategyService.updateWarStrategy(
        validatedId.id,
        validatedBody
      );

    return NextResponse.json(strategy);
  }

  static async delete(
    request: NextRequest,
    params: { id: string }
  ) {
    const validated =
      warStrategyIdSchema.parse(params);

    const result =
      await warStrategyService.deleteWarStrategy(
        validated.id
      );

    return NextResponse.json(result);
  }
}