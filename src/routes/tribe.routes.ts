import { NextRequest } from "next/server";

import TribeController from "@/controllers/tribe.controller";

import asyncHandler from "@/lib/asyncHandler";

export const GET = asyncHandler(
  async (request: NextRequest) => {
    return TribeController.getAll(request);
  }
);

export const POST = asyncHandler(
  async (request: NextRequest) => {
    return TribeController.create(request);
  }
);