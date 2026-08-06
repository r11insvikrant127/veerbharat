// src/validations/battle.ts

import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const createBattleSchema = z.object({
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

  battleDate: z.coerce.date().optional(),

  battleDateAccuracy: z
    .enum([
      "Exact",
      "Approximate",
      "Unknown",
    ])
    .optional()
    .default("Unknown"),

  locationId: objectId,

  historicalPeriodId: objectId.optional(),

  kingdomIds: z
    .array(objectId)
    .min(1, "At least one kingdom is required"),

  commanderIds: z
    .array(objectId)
    .min(1, "At least one commander is required"),

  casualties: z
    .number()
    .int()
    .nonnegative()
    .optional(),

  armySizes: z
    .record(z.string(), z.number().nonnegative())
    .optional(),

  strategyId: objectId.optional(),

  keyEvents: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

  significance: z
    .string()
    .trim()
    .optional()
    .default(""),

  description: z
    .string()
    .trim()
    .min(10),

  aftermath: z
    .string()
    .trim()
    .optional()
    .default(""),

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

export const updateBattleSchema =
  createBattleSchema.partial();

export type CreateBattleInput =
  z.infer<typeof createBattleSchema>;

export type UpdateBattleInput =
  z.infer<typeof updateBattleSchema>;