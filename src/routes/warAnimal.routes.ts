import { NextRequest } from "next/server";

import WarAnimalController from "@/controllers/warAnimal.controller";

import asyncHandler from "@/lib/asyncHandler";

export const GET = asyncHandler(
  async (request: NextRequest) => {
    return WarAnimalController.getAll(request);
  }
);

export const POST = asyncHandler(
  async (request: NextRequest) => {
    return WarAnimalController.create(request);
  }
);