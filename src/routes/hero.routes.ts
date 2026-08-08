import { NextRequest } from "next/server";

import HeroController from "@/controllers/hero.controller";

import asyncHandler from "@/lib/asyncHandler";

export const GET = asyncHandler(
  async (request: NextRequest) => {
    return HeroController.getAll(request);
  }
);

export const POST = asyncHandler(
  async (request: NextRequest) => {
    return HeroController.create(request);
  }
);