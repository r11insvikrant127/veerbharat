import { NextRequest } from "next/server";

import WarStrategyController from "@/controllers/warStrategy.controller";

import asyncHandler from "@/lib/asyncHandler";

export const GET = asyncHandler(
  async (request: NextRequest) => {
    return WarStrategyController.getAll(request);
  }
);

export const POST = asyncHandler(
  async (request: NextRequest) => {
    return WarStrategyController.create(request);
  }
);