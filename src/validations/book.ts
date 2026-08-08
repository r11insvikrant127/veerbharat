// src/validations/book.ts

import { z } from "zod";

import {
  objectIdArray,
  stringArray,
  statusEnum,
  paginationSchema,
} from "@/validations/common";

/* =====================================================
   BOOK TYPE
===================================================== */

export const bookTypeEnum = z.enum([
  "Biography",
  "Chronicle",
  "Research",
  "Travel Account",
  "Archaeology",
  "Inscription Study",
  "Government Publication",
]);

/* =====================================================
   CREATE
===================================================== */

export const createBookSchema = z.object({
  /* BASIC */

  title: z.string()
    .trim()
    .min(2)
    .max(250),

  bookType: bookTypeEnum,

  author: z.string()
    .trim()
    .optional()
    .default(""),

  language: z.string()
    .trim()
    .optional()
    .default(""),

  period: z.string()
    .trim()
    .optional()
    .default(""),

  description: z.string()
    .trim()
    .min(10),

  subjects: stringArray,

  /* REFERENCES */

  heroesMentioned: objectIdArray,

  battlesMentioned: objectIdArray,

  /* RESOURCE */

  pdfUrl: z.string()
    .trim()
    .url()
    .optional()
    .default(""),

  imageIds: objectIdArray,

  sourceIds: objectIdArray,

  tags: stringArray,

  /* ===================================================
     CROSS REFERENCES
  =================================================== */

  crossReferences: z
    .object({
      relatedHeroes: objectIdArray,

      relatedBattles: objectIdArray,

      relatedKingdoms: objectIdArray,

      relatedEvents: objectIdArray,

      relatedDynasties: objectIdArray,

      relatedSources: objectIdArray,

      relatedImages: objectIdArray,
    })
    .optional()
    .default({
      relatedHeroes: [],
      relatedBattles: [],
      relatedKingdoms: [],
      relatedEvents: [],
      relatedDynasties: [],
      relatedSources: [],
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

export const updateBookSchema =
  createBookSchema.partial();

/* =====================================================
   QUERY
===================================================== */

export const bookQuerySchema =
  paginationSchema.extend({
    search: z.string()
      .trim()
      .optional(),

    status: statusEnum.optional(),

    bookType: bookTypeEnum.optional(),

    author: z.string()
      .trim()
      .optional(),

    language: z.string()
      .trim()
      .optional(),

    period: z.string()
      .trim()
      .optional(),

    sort: z.enum([
      "title",
      "-title",
      "author",
      "-author",
      "createdAt",
      "-createdAt",
    ]).default("title"),
  });

/* =====================================================
   ID
===================================================== */

export const bookIdSchema = z.object({
  id: z.string()
    .trim()
    .min(1),
});

/* =====================================================
   TYPES
===================================================== */

export type CreateBookInput =
  z.infer<typeof createBookSchema>;

export type UpdateBookInput =
  z.infer<typeof updateBookSchema>;

export type BookQuery =
  z.infer<typeof bookQuerySchema>;

export type BookId =
  z.infer<typeof bookIdSchema>;