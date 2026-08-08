import { z } from "zod";

import {
  objectId,
  objectIdArray,
  stringArray,
  statusEnum,
  paginationSchema,
} from "@/validations/common";

/* =====================================================
   CREATE
===================================================== */

export const createQuoteSchema = z.object({
  /* BASIC */

  text: z.string()
    .trim()
    .min(2)
    .max(2000),

  language: z.string()
    .trim()
    .optional()
    .default(""),

  translation: z.string()
    .trim()
    .optional()
    .default(""),

  context: z.string()
    .trim()
    .optional()
    .default(""),

  /* REFERENCES */

  heroId: objectId.optional(),

  eventId: objectId.optional(),

  sourceId: objectId.optional(),

  /* CONTENT */

  tags: stringArray,

  /* ===================================================
     CROSS REFERENCES
  =================================================== */

  crossReferences: z
    .object({
      relatedHeroes: objectIdArray,

      relatedEvents: objectIdArray,

      relatedSources: objectIdArray,
    })
    .optional()
    .default({
      relatedHeroes: [],
      relatedEvents: [],
      relatedSources: [],
    }),

  /* ===================================================
     SEARCH
  =================================================== */

  searchFields: z
    .object({
      keywords: stringArray,

      nativeSpellings: stringArray,

      alternateSpellings: stringArray,

      aliases: stringArray,
    })
    .optional()
    .default({
      keywords: [],
      nativeSpellings: [],
      alternateSpellings: [],
      aliases: [],
    }),

  /* ===================================================
     METADATA
  =================================================== */

  metadata: z
    .object({
      createdBy: z.string()
        .trim()
        .optional()
        .default(""),

      verifiedBy: z.string()
        .trim()
        .optional()
        .default(""),

      version: z.number()
        .int()
        .positive()
        .default(1),
    })
    .optional()
    .default({
      createdBy: "",
      verifiedBy: "",
      version: 1,
    }),

  /* ===================================================
     STATUS
  =================================================== */

  status: statusEnum
    .optional()
    .default("Draft"),
});

/* =====================================================
   UPDATE
===================================================== */

export const updateQuoteSchema =
  createQuoteSchema.partial();

/* =====================================================
   QUERY
===================================================== */

export const quoteQuerySchema =
  paginationSchema.extend({
    search: z.string()
      .trim()
      .optional(),

    status: statusEnum.optional(),

    language: z.string()
      .trim()
      .optional(),

    heroId:
      objectId.optional(),

    eventId:
      objectId.optional(),

    sourceId:
      objectId.optional(),

    sort: z.enum([
      "text",
      "-text",
      "createdAt",
      "-createdAt",
    ]).default("text"),
  });

/* =====================================================
   ID
===================================================== */

export const quoteIdSchema = z.object({
  id: z.string()
    .trim()
    .min(1),
});

/* =====================================================
   TYPES
===================================================== */

export type CreateQuoteInput =
  z.infer<typeof createQuoteSchema>;

export type UpdateQuoteInput =
  z.infer<typeof updateQuoteSchema>;

export type QuoteQuery =
  z.infer<typeof quoteQuerySchema>;

export type QuoteId =
  z.infer<typeof quoteIdSchema>;