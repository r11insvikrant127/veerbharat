import { z } from "zod";

import {
  objectIdArray,
  stringArray,
  statusEnum,
  paginationSchema,
} from "@/validations/common";

/* =====================================================
   SOURCE TYPE
===================================================== */

export const sourceTypeEnum = z.enum([
  "Book",
  "Research Paper",
  "Government Record",
  "ASI",
  "Museum",
  "Archive",
  "Inscription",
  "Travel Account",
  "Chronicle",
  "Manuscript",
]);

export const reliabilityEnum = z.enum([
  "High",
  "Medium",
  "Low",
]);

/* =====================================================
   CREATE
===================================================== */

export const createSourceSchema = z.object({
  /* BASIC */

  title: z.string()
    .trim()
    .min(2)
    .max(250),

  type: sourceTypeEnum,

  author: z.string()
    .trim()
    .optional()
    .default(""),

  language: z.string()
    .trim()
    .optional()
    .default(""),

  year: z.string()
    .trim()
    .optional()
    .default(""),

  publisher: z.string()
    .trim()
    .optional()
    .default(""),

  edition: z.string()
    .trim()
    .optional()
    .default(""),

  isbn: z.string()
    .trim()
    .optional()
    .default(""),

  pages: z.number()
    .int()
    .positive()
    .optional(),

  volume: z.string()
    .trim()
    .optional()
    .default(""),

  publicationYear: z.string()
    .trim()
    .optional()
    .default(""),

  /* CONTENT */

  description: z.string()
    .trim()
    .min(10),

  reliability: reliabilityEnum
    .optional()
    .default("Medium"),

  location: z.string()
    .trim()
    .optional()
    .default(""),

  url: z.string()
    .trim()
    .url()
    .optional()
    .default(""),

  tags: stringArray,

  /* ===================================================
     CROSS REFERENCES
  =================================================== */

  crossReferences: z
    .object({
      relatedHeroes: objectIdArray,

      relatedBooks: objectIdArray,

      relatedBattles: objectIdArray,

      relatedKingdoms: objectIdArray,

      relatedPlaces: objectIdArray,

      relatedImages: objectIdArray,
    })
    .optional()
    .default({
      relatedHeroes: [],
      relatedBooks: [],
      relatedBattles: [],
      relatedKingdoms: [],
      relatedPlaces: [],
      relatedImages: [],
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

export const updateSourceSchema =
  createSourceSchema.partial();

/* =====================================================
   QUERY
===================================================== */

export const sourceQuerySchema =
  paginationSchema.extend({
    search: z.string()
      .trim()
      .optional(),

    status: statusEnum.optional(),

    type: sourceTypeEnum.optional(),

    reliability:
      reliabilityEnum.optional(),

    author: z.string()
      .trim()
      .optional(),

    language: z.string()
      .trim()
      .optional(),

    publisher: z.string()
      .trim()
      .optional(),

    sort: z.enum([
      "title",
      "-title",
      "author",
      "-author",
      "publicationYear",
      "-publicationYear",
      "createdAt",
      "-createdAt",
    ]).default("title"),
  });

/* =====================================================
   ID
===================================================== */

export const sourceIdSchema = z.object({
  id: z.string()
    .trim()
    .min(1),
});

/* =====================================================
   TYPES
===================================================== */

export type CreateSourceInput =
  z.infer<typeof createSourceSchema>;

export type UpdateSourceInput =
  z.infer<typeof updateSourceSchema>;

export type SourceQuery =
  z.infer<typeof sourceQuerySchema>;

export type SourceId =
  z.infer<typeof sourceIdSchema>;