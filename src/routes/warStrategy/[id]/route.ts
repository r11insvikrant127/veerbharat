import { NextRequest } from "next/server";

import WarStrategyController from "@/controllers/warStrategy.controller";

import asyncHandler from "@/lib/asyncHandler";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export const GET = asyncHandler(
  async (
    request: NextRequest,
    { params }: RouteParams
  ) => {
    const resolvedParams = await params;

    return WarStrategyController.getById(
      request,
      resolvedParams
    );
  }
);

export const PATCH = asyncHandler(
  async (
    request: NextRequest,
    { params }: RouteParams
  ) => {
    const resolvedParams = await params;

    return WarStrategyController.update(
      request,
      resolvedParams
    );
  }
);

export const DELETE = asyncHandler(
  async (
    request: NextRequest,
    { params }: RouteParams
  ) => {
    const resolvedParams = await params;

    return WarStrategyController.delete(
      request,
      resolvedParams
    );
  }
);