import { NextRequest } from "next/server";

import AllianceController from "@/controllers/alliance.controller";

import asyncHandler from "@/lib/asyncHandler";

export const GET = asyncHandler(
  async (request: NextRequest) => {
    return AllianceController.getAll(request);
  }
);

export const POST = asyncHandler(
  async (request: NextRequest) => {
    return AllianceController.create(request);
  }
);