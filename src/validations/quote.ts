// src/validations/quote.ts

import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const createQuoteSchema = z.object({
  text: z.string().trim().min(2).max(5000),

  language: z.string().trim().optional().default(""),

  translation: z.string().trim().optional().default(""),

  context: z.string().trim().optional().default(""),

  heroId: objectId.optional(),

  eventId: objectId.optional(),

  sourceId: objectId.optional(),

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

export const updateQuoteSchema =
  createQuoteSchema.partial();

export type CreateQuoteInput =
  z.infer<typeof createQuoteSchema>;

export type UpdateQuoteInput =
  z.infer<typeof updateQuoteSchema>;