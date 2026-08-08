import { NextRequest } from "next/server";

import FortController from "@/controllers/fort.controller";

import asyncHandler from "@/lib/asyncHandler";

export const GET = asyncHandler(
  async (request: NextRequest) => {
    return FortController.getAll(request);
  }
);

export const POST = asyncHandler(
  async (request: NextRequest) => {
    return FortController.create(request);
  }
);