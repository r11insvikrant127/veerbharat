import { NextRequest } from "next/server";

import HistoricalPersonalityController from "@/controllers/historicalPersonality.controller";

import asyncHandler from "@/lib/asyncHandler";

export const GET = asyncHandler(
  async (request: NextRequest) => {
    return HistoricalPersonalityController.getAll(request);
  }
);

export const POST = asyncHandler(
  async (request: NextRequest) => {
    return HistoricalPersonalityController.create(request);
  }
);