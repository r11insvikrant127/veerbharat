import { NextRequest } from "next/server";

import WeaponController from "@/controllers/weapon.controller";

import asyncHandler from "@/lib/asyncHandler";

export const GET = asyncHandler(
  async (request: NextRequest) => {
    return WeaponController.getAll(request);
  }
);

export const POST = asyncHandler(
  async (request: NextRequest) => {
    return WeaponController.create(request);
  }
);