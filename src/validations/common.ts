// src/validations/common.ts

//defines reusable things

import { z } from "zod";

export const objectId = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");