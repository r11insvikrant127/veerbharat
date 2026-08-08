import { NextRequest } from "next/server";

import PlaceController from "@/controllers/place.controller";

import asyncHandler from "@/lib/asyncHandler";

export const GET = asyncHandler(
  async (request: NextRequest) => {
    return PlaceController.getAll(request);
  }
);

export const POST = asyncHandler(
  async (request: NextRequest) => {
    return PlaceController.create(request);
  }
);