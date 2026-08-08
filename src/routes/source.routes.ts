import { NextRequest } from "next/server";

import SourceController from "@/controllers/source.controller";

import asyncHandler from "@/lib/asyncHandler";

export const GET = asyncHandler(
  async (request: NextRequest) => {
    return SourceController.getAll(request);
  }
);

export const POST = asyncHandler(
  async (request: NextRequest) => {
    return SourceController.create(request);
  }
);