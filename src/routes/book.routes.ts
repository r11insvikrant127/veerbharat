import { NextRequest } from "next/server";

import BookController from "@/controllers/book.controller";

import asyncHandler from "@/lib/asyncHandler";

export const GET = asyncHandler(
  async (request: NextRequest) => {
    return BookController.getAll(request);
  }
);

export const POST = asyncHandler(
  async (request: NextRequest) => {
    return BookController.create(request);
  }
);