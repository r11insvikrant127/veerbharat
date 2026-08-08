import { NextRequest } from "next/server";

import HeroController from "@/controllers/hero.controller";

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

    return HeroController.getById(
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

    return HeroController.update(
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

    return HeroController.delete(
      request,
      resolvedParams
    );
  }
);