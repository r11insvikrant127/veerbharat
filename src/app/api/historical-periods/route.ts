import { NextRequest } from "next/server";

import HistoricalPeriodController from "@/controllers/historicalPeriod.controller";
import { asyncHandler } from "@/lib/asyncHandler";
import { ApiResponse } from "@/utils/apiResponse";

export const GET = asyncHandler(
  async (request: NextRequest) => {
    const result =
      await HistoricalPeriodController.getAll(request);

    return ApiResponse.paginated(
      result.data,
      result.pagination,
      "Historical periods fetched successfully."
    );
  }
);

export const POST = asyncHandler(
  async (request: NextRequest) => {
    const result =
      await HistoricalPeriodController.create(request);

    return ApiResponse.success(
      result,
      "Historical period created successfully.",
      201
    );
  }
);