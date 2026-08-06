// src/validations/fort.ts

import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const createFortSchema = z.object({
  name: z.string().trim().min(2).max(150),

  nativeName: z.string().trim().optional().default(""),

  alternativeNames: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

  locationId: objectId,

  constructionDate: z.coerce.date().optional(),

  constructionDateAccuracy: z
    .enum([
      "Exact",
      "Approximate",
      "Unknown",
    ])
    .optional()
    .default("Unknown"),

  builderId: objectId.optional(),

  kingdomId: objectId.optional(),

  architectureStyle: z
    .string()
    .trim()
    .optional()
    .default(""),

  features: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

  fortStatus: z
    .enum([
      "Active",
      "Ruins",
      "Restored",
    ])
    .optional(),

  description: z.string().trim().min(10),

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

export const updateFortSchema =
  createFortSchema.partial();

export type CreateFortInput =
  z.infer<typeof createFortSchema>;

export type UpdateFortInput =
  z.infer<typeof updateFortSchema>;