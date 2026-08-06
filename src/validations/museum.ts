// src/validations/museum.ts

import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const createMuseumSchema = z.object({
  name: z.string().trim().min(2).max(150),

  nativeName: z
    .string()
    .trim()
    .optional()
    .default(""),

  locationId: objectId,

  type: z.enum([
    "Museum",
    "Memorial",
    "Cultural Center",
  ]),

  description: z
    .string()
    .trim()
    .min(10),

  highlights: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

  openingHours: z
    .string()
    .trim()
    .optional()
    .default(""),

  entryFee: z
    .string()
    .trim()
    .optional()
    .default(""),

  website: z
    .string()
    .trim()
    .url()
    .optional(),

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

export const updateMuseumSchema =
  createMuseumSchema.partial();

export type CreateMuseumInput =
  z.infer<typeof createMuseumSchema>;

export type UpdateMuseumInput =
  z.infer<typeof updateMuseumSchema>;