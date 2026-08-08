import { NextRequest } from "next/server";

import MuseumController from "@/controllers/museum.controller";

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

    return MuseumController.getById(
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

    return MuseumController.update(
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

    return MuseumController.delete(
      request,
      resolvedParams
    );
  }
);