import { NextRequest } from "next/server";

import DynastyController from "@/controllers/dynasty.controller";

import asyncHandler from "@/lib/asyncHandler";

export const GET = asyncHandler(
  async (request: NextRequest) => {
    return DynastyController.getAll(request);
  }
);

export const POST = asyncHandler(
  async (request: NextRequest) => {
    return DynastyController.create(request);
  }
);