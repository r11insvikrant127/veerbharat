import { NextRequest } from "next/server";

import MuseumController from "@/controllers/museum.controller";

import asyncHandler from "@/lib/asyncHandler";

export const GET = asyncHandler(
  async (request: NextRequest) => {
    return MuseumController.getAll(request);
  }
);

export const POST = asyncHandler(
  async (request: NextRequest) => {
    return MuseumController.create(request);
  }
);