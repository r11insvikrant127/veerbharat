import { NextRequest } from "next/server";

import ExhibitionController from "@/controllers/exhibition.controller";

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

    return ExhibitionController.getById(
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

    return ExhibitionController.update(
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

    return ExhibitionController.delete(
      request,
      resolvedParams
    );
  }
);