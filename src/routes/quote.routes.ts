import { NextRequest } from "next/server";

import QuoteController from "@/controllers/quote.controller";

import asyncHandler from "@/lib/asyncHandler";

export const GET = asyncHandler(
  async (request: NextRequest) => {
    return QuoteController.getAll(request);
  }
);

export const POST = asyncHandler(
  async (request: NextRequest) => {
    return QuoteController.create(request);
  }
);