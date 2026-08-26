import { z } from "zod";

import {
  objectId,
  objectIdArray,
  stringArray,
  statusEnum,
  paginationSchema,
} from "@/validations/common";

/* =====================================================
   IMAGE TYPE
===================================================== */

export const imageTypeEnum = z.enum([
  "Painting",
  "Portrait",
  "Photograph",
  "Statue",
  "Map",
  "Coin",
  "Weapon",
  "Inscription",
  "Fort",
  "Manuscript",
]);

/* =====================================================
   CREATE
===================================================== */

export const createImageSchema = z.object({
  /* BASIC */

  title: z.string()
    .trim()
    .min(2)
    .max(250),

  url: z.string()
    .trim()
    .url(),

  altText: z.string()
    .trim()
    .min(2)
    .max(300),

  imageType: imageTypeEnum,

  /* DETAILS */

  description: z.string()
    .trim()
    .optional()
    .default(""),

  /*
    Optional section title to which this image belongs.

    Example:
    "The Wagon Tragedy"
    "Weapons Used During the Rebellion"
  */
  relatedSection: z.string()
    .trim()
    .min(1)
    .max(300)
    .optional(),

  artist: z.string()
    .trim()
    .optional()
    .default(""),

  period: z.string()
    .trim()
    .optional()
    .default(""),

  license: z.string()
    .trim()
    .optional()
    .default(""),

  copyright: z.string()
    .trim()
    .optional()
    .default(""),

  photographer: z.string()
    .trim()
    .optional()
    .default(""),

  painting: z.boolean()
    .optional()
    .default(false),

  aiGenerated: z.boolean()
    .optional()
    .default(false),

  restored: z.boolean()
    .optional()
    .default(false),

  yearCreated: z.string()
    .trim()
    .optional()
    .default(""),

  /* SOURCE */

  sourceId: objectId.optional(),

  tags: stringArray,

  /* ===================================================
     CROSS REFERENCES
  =================================================== */

  crossReferences: z
    .object({
      relatedHeroes: objectIdArray,

      relatedPlaces: objectIdArray,

      relatedBattles: objectIdArray,
    })
    .optional()
    .default({
      relatedHeroes: [],
      relatedPlaces: [],
      relatedBattles: [],
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

export const updateImageSchema =
  createImageSchema.partial();

/* =====================================================
   QUERY
===================================================== */

export const imageQuerySchema =
  paginationSchema.extend({
    search: z.string()
      .trim()
      .optional(),

    status: statusEnum.optional(),

    imageType:
      imageTypeEnum.optional(),

    sourceId:
      objectId.optional(),

    painting:
      z.coerce.boolean().optional(),

    aiGenerated:
      z.coerce.boolean().optional(),

    restored:
      z.coerce.boolean().optional(),

    sort: z.enum([
      "title",
      "-title",
      "createdAt",
      "-createdAt",
    ]).default("title"),
  });

/* =====================================================
   ID
===================================================== */

export const imageIdSchema = z.object({
  id: z.string()
    .trim()
    .min(1),
});

/* =====================================================
   TYPES
===================================================== */

export type CreateImageInput =
  z.infer<typeof createImageSchema>;

export type UpdateImageInput =
  z.infer<typeof updateImageSchema>;

export type ImageQuery =
  z.infer<typeof imageQuerySchema>;

export type ImageId =
  z.infer<typeof imageIdSchema>;