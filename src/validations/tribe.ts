// src/validations/tribe.ts

import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const createTribeSchema = z.object({
  name: z.string().trim().min(2).max(100),

  nativeName: z
    .string()
    .trim()
    .optional()
    .default(""),

  region: z
    .string()
    .trim()
    .optional()
    .default(""),

  historicalRole: z
    .string()
    .trim()
    .optional()
    .default(""),

  description: z
    .string()
    .trim()
    .min(10),

  sourceIds: z
    .array(objectId)
    .optional()
    .default([]),

  tags: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

  status: z
    .enum([
      "Draft",
      "Verified",
      "Published",
      "Needs Review",
    ])
    .optional()
    .default("Draft"),
});

export const updateTribeSchema =
  createTribeSchema.partial();

export type CreateTribeInput =
  z.infer<typeof createTribeSchema>;

export type UpdateTribeInput =
  z.infer<typeof updateTribeSchema>;