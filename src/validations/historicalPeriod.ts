// src/validations/historicalPeriod.ts

import { z } from "zod";

export const createHistoricalPeriodSchema = z.object({
  name: z.string().trim().min(2).max(100),

  nativeName: z.string().trim().optional().default(""),

  alternativeNames: z.array(z.string().trim()).optional().default([]),

  startYear: z.string().trim().min(1),

  endYear: z.string().trim().min(1),

  duration: z.string().trim().optional().default(""),

  description: z.string().trim().min(10),

  significance: z.string().trim().optional().default(""),

  keyCharacteristics: z
    .array(z.string().trim())
    .optional()
    .default([]),

  tags: z
    .array(z.string().trim())
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

export const updateHistoricalPeriodSchema =
  createHistoricalPeriodSchema.partial();

export const historicalPeriodQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  search: z.string().trim().optional(),

  status: z
    .enum([
      "Draft",
      "Verified",
      "Published",
      "Needs Review",
    ])
    .optional(),

  sort: z
    .enum([
      "name",
      "-name",
      "createdAt",
      "-createdAt",
      "startYear",
      "-startYear",
    ])
    .default("name"),
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