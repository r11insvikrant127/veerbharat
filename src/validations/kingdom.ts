// src/validations/kingdom.ts

import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const createKingdomSchema = z.object({
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

  establishedDate: z.coerce.date().optional(),

  establishedDateAccuracy: z
    .enum([
      "Exact",
      "Approximate",
      "Unknown",
    ])
    .optional()
    .default("Unknown"),

  dissolvedDate: z.coerce.date().optional(),

  dissolvedDateAccuracy: z
    .enum([
      "Exact",
      "Approximate",
      "Unknown",
    ])
    .optional()
    .default("Unknown"),

  capitalId: objectId.optional(),

  dynastyId: objectId.optional(),

  founderId: objectId.optional(),

  lastRulerId: objectId.optional(),

  area: z
    .string()
    .trim()
    .optional()
    .default(""),

  governmentType: z
    .string()
    .trim()
    .optional()
    .default(""),

  currencies: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

  officialLanguages: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

  officialReligions: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

  nationalAnimal: z
    .string()
    .trim()
    .optional()
    .default(""),

  nationalSymbols: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

  historicalPeriodId: objectId.optional(),

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

export const updateKingdomSchema =
  createKingdomSchema.partial();

export type CreateKingdomInput =
  z.infer<typeof createKingdomSchema>;

export type UpdateKingdomInput =
  z.infer<typeof updateKingdomSchema>;