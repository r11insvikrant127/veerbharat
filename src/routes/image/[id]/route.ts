import { NextRequest } from "next/server";

import ImageController from "@/controllers/image.controller";

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

    return ImageController.getById(
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

    return ImageController.update(
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

    return ImageController.delete(
      request,
      resolvedParams
    );
  }
);