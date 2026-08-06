// src/app/api/historical-periods/[id]/route.ts

import { NextRequest } from "next/server";

import HistoricalPeriodController from "@/controllers/historicalPeriod.controller";
import { asyncHandler } from "@/lib/asyncHandler";
import { ApiResponse } from "@/utils/apiResponse";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const GET = asyncHandler<RouteContext>(
  async (request, { params }) => {
    const { id } = await params;

    const result =
      await HistoricalPeriodController.getById(
        request,
        { id }
      );

    return ApiResponse.success(
      result,
      "Historical period fetched successfully."
    );
  }
);

export const PATCH = asyncHandler<RouteContext>(
  async (request, { params }) => {
    const { id } = await params;

    const result =
      await HistoricalPeriodController.update(
        request,
        { id }
      );

    return ApiResponse.success(
      result,
      "Historical period updated successfully."
    );
  }
);

export const DELETE = asyncHandler<RouteContext>(
  async (request, { params }) => {
    const { id } = await params;

    const result =
      await HistoricalPeriodController.delete(
        request,
        { id }
      );

    return ApiResponse.success(
      result,
      "Historical period deleted successfully."
    );
  }
);