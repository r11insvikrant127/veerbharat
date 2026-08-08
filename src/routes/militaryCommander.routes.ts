import { NextRequest } from "next/server";

import MilitaryCommanderController from "@/controllers/militaryCommander.controller";

import asyncHandler from "@/lib/asyncHandler";

export const GET = asyncHandler(
  async (request: NextRequest) => {
    return MilitaryCommanderController.getAll(request);
  }
);

export const POST = asyncHandler(
  async (request: NextRequest) => {
    return MilitaryCommanderController.create(request);
  }
);