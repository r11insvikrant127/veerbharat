import { NextRequest } from "next/server";

import HistoricalPeriodController from "@/controllers/historicalPeriod.controller";

import asyncHandler from "@/lib/asyncHandler";

export const GET = asyncHandler(
  async (request: NextRequest) => {
    return HistoricalPeriodController.getAll(request);
  }
);

export const POST = asyncHandler(
  async (request: NextRequest) => {
    return HistoricalPeriodController.create(request);
  }
);