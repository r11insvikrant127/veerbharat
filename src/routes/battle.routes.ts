import { NextRequest } from "next/server";

import BattleController from "@/controllers/battle.controller";

import asyncHandler from "@/lib/asyncHandler";

export const GET = asyncHandler(
  async (request: NextRequest) => {
    return BattleController.getAll(request);
  }
);

export const POST = asyncHandler(
  async (request: NextRequest) => {
    return BattleController.create(request);
  }
);