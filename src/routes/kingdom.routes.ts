import { NextRequest } from "next/server";

import KingdomController from "@/controllers/kingdom.controller";

import asyncHandler from "@/lib/asyncHandler";

export const GET = asyncHandler(
  async (request: NextRequest) => {
    return KingdomController.getAll(request);
  }
);

export const POST = asyncHandler(
  async (request: NextRequest) => {
    return KingdomController.create(request);
  }
);