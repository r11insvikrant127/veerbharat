// src/validations/memorial.ts

import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const createMemorialSchema = z.object({
  name: z.string().trim().min(2).max(150),

  nativeName: z
    .string()
    .trim()
    .optional()
    .default(""),

  type: z.enum([
    "Smarak",
    "Chatri",
    "Monument",
    "Tourist Attraction",
    "Museum",
  ]),

  locationId: objectId,

  builtBy: objectId.optional(),

  yearBuilt: z
    .string()
    .trim()
    .optional()
    .default(""),

  description: z
    .string()
    .trim()
    .min(10),

  significance: z
    .string()
    .trim()
    .optional()
    .default(""),

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

export const updateMemorialSchema =
  createMemorialSchema.partial();

export type CreateMemorialInput =
  z.infer<typeof createMemorialSchema>;

export type UpdateMemorialInput =
  z.infer<typeof updateMemorialSchema>;