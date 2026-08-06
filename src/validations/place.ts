// src/validations/place.ts

import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const createPlaceSchema = z.object({
  name: z.string().trim().min(2).max(100),

  nativeName: z.string().trim().optional().default(""),

  alternativeNames: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

  type: z.enum([
    "City",
    "Village",
    "Fort",
    "Hill",
    "Valley",
    "Pass",
    "Canal",
    "River",
  ]),

  coordinates: z
    .object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    })
    .optional(),

  state: z.string().trim().optional().default(""),

  country: z
    .string()
    .trim()
    .optional()
    .default("India"),

  region: z.string().trim().optional().default(""),

  significance: z
    .string()
    .trim()
    .optional()
    .default(""),

  description: z.string().trim().min(10),

  historicalPeriodId: objectId.optional(),

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

export const updatePlaceSchema =
  createPlaceSchema.partial();

export type CreatePlaceInput =
  z.infer<typeof createPlaceSchema>;

export type UpdatePlaceInput =
  z.infer<typeof updatePlaceSchema>;