import { z } from "zod";

/* ============================================================
 * LOCATION
 * ============================================================ */

const historicalLocationSchema = z.object({
  name: z.string().trim().min(1),
  region: z.string().trim().optional(),
  presentDayLocation: z.string().trim().optional(),
});

/* ============================================================
 * ALLEGIANCE
 * ============================================================ */

const historicalAllegianceSchema = z.object({
  entity: z.string().trim().min(1),
  role: z.string().trim().optional(),
});

/* ============================================================
 * MAJOR EVENT
 * ============================================================ */

const historicalMajorEventSchema = z.object({
  name: z.string().trim().min(1),
  year: z.coerce.number().int().optional(),
  date: z.union([z.string(), z.date()]).optional(),
  role: z.string().trim().optional(),
  description: z.string().trim().optional(),
});

/* ============================================================
 * SOURCE
 * ============================================================ */

const historicalSourceSchema = z.object({
  title: z.string().trim().optional(),
  author: z.string().trim().optional(),
  url: z.string().trim().optional(),
  publication: z.string().trim().optional(),
  year: z.coerce.number().int().optional(),
  accessedAt: z.union([z.string(), z.date()]).optional(),
  sourceId: z.string().trim().optional(),
});

/* ============================================================
 * VERIFICATION
 * ============================================================ */

const historicalVerificationSchema = z.object({
  isVerified: z.boolean().optional(),
  verifiedBy: z.string().trim().optional(),
  verifiedAt: z.union([z.string(), z.date()]).optional(),
  verificationNotes: z.string().trim().optional(),
});

/* ============================================================
 * CREATE HISTORICAL PERSONALITY
 * ============================================================ */

export const createHistoricalPersonalitySchema =
  z.object({
    /* --------------------------- IDENTITY --------------------------- */

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

    alternativeNames: z
      .array(z.string().trim())
      .optional(),

    title: z
      .string()
      .trim()
      .optional(),

    gender: z
      .string()
      .trim()
      .optional(),

    category: z
      .string()
      .trim()
      .optional(),

    roles: z
      .array(z.string().trim())
      .optional(),

    /* ----------------------------- LIFE ----------------------------- */

    birthDate: z
      .union([
        z.string(),
        z.date(),
      ])
      .optional(),

    birthDateAccuracy: z
      .string()
      .trim()
      .optional(),

    birthplace:
      historicalLocationSchema.optional(),

    deathDate: z
      .union([
        z.string(),
        z.date(),
      ])
      .optional(),

    deathDateAccuracy: z
      .string()
      .trim()
      .optional(),

    deathPlace:
      historicalLocationSchema.optional(),

    /* -------------------------- BACKGROUND -------------------------- */

    dynasty: z
      .string()
      .trim()
      .optional(),

    kingdom: z
      .string()
      .trim()
      .optional(),

    allegiance: z
      .array(
        historicalAllegianceSchema
      )
      .optional(),

    /* ------------------------- DESCRIPTION -------------------------- */

    shortDescription: z
      .string()
      .trim()
      .optional(),

    biography: z
      .union([
        z.string(),
        z.record(z.string(), z.unknown()),
      ])
      .optional(),

    knownFor: z
      .array(z.string().trim())
      .optional(),

    majorEvents: z
      .array(
        historicalMajorEventSchema
      )
      .optional(),

    legacy: z
      .string()
      .trim()
      .optional(),

    classificationReason: z
      .string()
      .trim()
      .optional(),

    /* ----------------------- HISTORICAL CONTEXT --------------------- */

    period: z
      .string()
      .trim()
      .optional(),

    era: z
      .string()
      .trim()
      .optional(),

    achievements: z
      .array(z.string().trim())
      .optional(),

    controversies: z
      .array(z.string().trim())
      .optional(),

    /* ---------------------------- SEARCH ---------------------------- */

    tags: z
      .array(z.string().trim())
      .optional(),

    searchFields: z
      .array(z.string().trim())
      .optional(),

    /* ------------------------- RESEARCH DATA ------------------------ */

    notes: z
      .string()
      .trim()
      .optional(),

    sources: z
      .array(
        historicalSourceSchema
      )
      .optional(),

    verification:
      historicalVerificationSchema.optional(),

    /* ----------------------------- MEDIA ----------------------------- */

    imageIds: z
      .array(z.string())
      .optional(),

    /* ---------------------------- STATUS ----------------------------- */

    status: z
      .string()
      .trim()
      .optional(),
  });

/* ============================================================
 * QUERY
 * ============================================================ */

export const historicalPersonalityQuerySchema =
  z.object({
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