// src/validations/exhibition.ts

import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const createExhibitionSchema = z.object({
  name: z.string().trim().min(2).max(150),

  description: z
    .string()
    .trim()
    .min(10),

  museumId: objectId,

  theme: z
    .string()
    .trim()
    .optional()
    .default(""),

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

export const updateExhibitionSchema =
  createExhibitionSchema.partial();

export type CreateExhibitionInput =
  z.infer<typeof createExhibitionSchema>;

export type UpdateExhibitionInput =
  z.infer<typeof updateExhibitionSchema>;