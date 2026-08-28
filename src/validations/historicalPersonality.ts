import { z } from "zod";

export const createHistoricalPersonalitySchema = z.object({
  historicalPersonalityId: z
    .string()
    .trim()
    .min(1)
    .optional(),

  name: z
    .string()
    .trim()
    .min(1, "Name is required."),

  nativeName: z
    .string()
    .trim()
    .optional(),

  title: z
    .string()
    .trim()
    .optional(),

  gender: z
    .string()
    .trim()
    .optional(),

  shortDescription: z
    .string()
    .trim()
    .optional(),

  biography: z
    .string()
    .optional(),

  birthDate: z
    .union([
      z.string(),
      z.date(),
    ])
    .optional(),

  deathDate: z
    .union([
      z.string(),
      z.date(),
    ])
    .optional(),

  status: z
    .string()
    .trim()
    .optional(),

  imageIds: z
    .array(z.string())
    .optional(),
});

export const historicalPersonalityQuerySchema = z.object({
  page: z
    .coerce
    .number()
    .int()
    .positive()
    .default(1),

  limit: z
    .coerce
    .number()
    .int()
    .positive()
    .max(100)
    .default(10),

  search: z
    .string()
    .trim()
    .optional()
    .default(""),

  status: z
    .string()
    .trim()
    .optional(),

  sort: z
    .string()
    .trim()
    .optional(),
});

export type CreateHistoricalPersonalityInput =
  z.infer<
    typeof createHistoricalPersonalitySchema
  >;

export type HistoricalPersonalityQuery =
  z.infer<
    typeof historicalPersonalityQuerySchema
  >;