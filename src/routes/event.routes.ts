import { NextRequest } from "next/server";

import EventController from "@/controllers/event.controller";

import asyncHandler from "@/lib/asyncHandler";

export const GET = asyncHandler(
  async (request: NextRequest) => {
    return EventController.getAll(request);
  }
);

export const POST = asyncHandler(
  async (request: NextRequest) => {
    return EventController.create(request);
  }
);