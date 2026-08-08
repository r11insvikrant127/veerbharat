import { NextRequest } from "next/server";

import ImageController from "@/controllers/image.controller";

import asyncHandler from "@/lib/asyncHandler";

export const GET = asyncHandler(
  async (request: NextRequest) => {
    return ImageController.getAll(request);
  }
);

export const POST = asyncHandler(
  async (request: NextRequest) => {
    return ImageController.create(request);
  }
);