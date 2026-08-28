import { NextRequest } from "next/server";

import HistoricalPersonalityController from "@/controllers/historicalPersonality.controller";

import asyncHandler from "@/lib/asyncHandler";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const GET = asyncHandler(
  async (
    request: NextRequest,
    context: RouteContext
  ) => {
    const { id } = await context.params;

    return HistoricalPersonalityController.getById(
      request,
      id
    );
  }
);