import { NextRequest } from "next/server";

import ExhibitionController from "@/controllers/exhibition.controller";

import asyncHandler from "@/lib/asyncHandler";

export const GET = asyncHandler(
  async (request: NextRequest) => {
    return ExhibitionController.getAll(request);
  }
);

export const POST = asyncHandler(
  async (request: NextRequest) => {
    return ExhibitionController.create(request);
  }
);