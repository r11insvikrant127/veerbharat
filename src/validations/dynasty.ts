// src/validations/dynasty.ts

import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const createDynastySchema = z.object({
  name: z.string().trim().min(2).max(150),

  nativeName: z
    .string()
    .trim()
    .optional()
    .default(""),

  alternativeNames: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

  origin: z
    .string()
    .trim()
    .optional()
    .default(""),

  founderId: objectId.optional(),

  kingdomId: objectId.optional(),

  description: z
    .string()
    .trim()
    .min(10),

  historicalPeriodId: objectId.optional(),

  sourceIds: z
    .array(objectId)
    .min(1, "At least one source is required"),

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

export const updateDynastySchema =
  createDynastySchema.partial();

export type CreateDynastyInput =
  z.infer<typeof createDynastySchema>;

export type UpdateDynastyInput =
  z.infer<typeof updateDynastySchema>;