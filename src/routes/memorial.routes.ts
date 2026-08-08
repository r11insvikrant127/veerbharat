import { NextRequest } from "next/server";

import MemorialController from "@/controllers/memorial.controller";

import asyncHandler from "@/lib/asyncHandler";

export const GET = asyncHandler(
  async (request: NextRequest) => {
    return MemorialController.getAll(request);
  }
);

export const POST = asyncHandler(
  async (request: NextRequest) => {
    return MemorialController.create(request);
  }
);