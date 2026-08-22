// src/validations/historicalPeriod.ts

import { z } from "zod";

import {
  objectId,
  objectIdArray,
  stringArray,
  statusEnum,
  paginationSchema,
} from "@/validations/common";

export const createHistoricalPeriodSchema = z.object({
  name: z.string().trim().min(2).max(100),

  nativeName: z.string().trim().optional().default(""),

  alternativeNames: stringArray,

  startYear: z.string().trim().min(1),

  endYear: z.string().trim().min(1),

  duration: z.string().trim().optional().default(""),

  precededBy: objectId.optional(),

  succeededBy: objectId.optional(),

  majorDynasties: objectIdArray,

  majorKingdoms: objectIdArray,

  majorHeroes: objectIdArray,

  majorEvents: objectIdArray,

  description: z.string().trim().min(10),

  significance: z.string().trim().optional().default(""),

  keyCharacteristics: stringArray,

  imageIds: objectIdArray,

  sourceIds: objectIdArray,

  tags: stringArray,

  status: statusEnum
    .optional()
    .default("Draft"),
});

export const updateHistoricalPeriodSchema =
  createHistoricalPeriodSchema.partial();

export const historicalPeriodQuerySchema =
  paginationSchema.extend({
    search: z.string().trim().optional(),

    status: statusEnum.optional(),

    sort: z.enum([
      "name",
      "-name",
      "createdAt",
      "-createdAt",
      "startYear",
      "-startYear",
    ]).default("name"),
  });

export type HistoricalPeriodQuery =
  z.infer<typeof historicalPeriodQuerySchema>;

export type CreateHistoricalPeriodInput =
  z.infer<typeof createHistoricalPeriodSchema>;

export type UpdateHistoricalPeriodInput =
  z.infer<typeof updateHistoricalPeriodSchema>;

export const historicalPeriodIdSchema = z.object({
  id: z.string().trim().min(1),
});

export type HistoricalPeriodId =
  z.infer<typeof historicalPeriodIdSchema>;
