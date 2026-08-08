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

export const createPlaceSchema = z.object({
  /* BASIC */

  name: z.string().trim().min(2).max(150),

  nativeName: z.string().trim().optional().default(""),

  alternativeNames: stringArray,

  type: z.enum([
    "City",
    "Village",
    "Fort",
    "Hill",
    "Valley",
    "Pass",
    "Canal",
    "River",
  ]),

  /* LOCATION */

  coordinates: z
    .object({
      latitude: z.number().min(-90).max(90),

      longitude: z.number().min(-180).max(180),
    })
    .optional(),

  state: z.string().trim().optional().default(""),

  country: z
    .string()
    .trim()
    .optional()
    .default("India"),

  region: z.string().trim().optional().default(""),

  /* CONTENT */

  significance: z.string().trim().optional().default(""),

  description: z.string().trim().min(10),

  historicalPeriodId: objectId.optional(),

  imageIds: objectIdArray,

  sourceIds: objectIdArray,

  tags: stringArray,

  /* CROSS REFERENCES */

  crossReferences: z
    .object({
      relatedHeroes: objectIdArray,

      relatedKingdoms: objectIdArray,

      relatedBattles: objectIdArray,

      relatedEvents: objectIdArray,

      relatedForts: objectIdArray,

      relatedMuseums: objectIdArray,

      relatedSources: objectIdArray,

      relatedImages: objectIdArray,
    })
    .optional()
    .default({
      relatedHeroes: [],
      relatedKingdoms: [],
      relatedBattles: [],
      relatedEvents: [],
      relatedForts: [],
      relatedMuseums: [],
      relatedSources: [],
      relatedImages: [],
    }),

  /* SEARCH */

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

  /* METADATA */

  metadata: z
    .object({
      createdBy: z.string().trim().optional().default(""),

      verifiedBy: z.string().trim().optional().default(""),

      version: z.number().int().positive().default(1),
    })
    .optional()
    .default({
      createdBy: "",
      verifiedBy: "",
      version: 1,
    }),

  status: statusEnum
    .optional()
    .default("Draft"),
});

/* =====================================================
   UPDATE
===================================================== */

export const updatePlaceSchema =
  createPlaceSchema.partial();

/* =====================================================
   QUERY
===================================================== */

export const placeQuerySchema =
  paginationSchema.extend({
    search: z.string().trim().optional(),

    status: statusEnum.optional(),

    historicalPeriodId: objectId.optional(),

    type: z
      .enum([
        "City",
        "Village",
        "Fort",
        "Hill",
        "Valley",
        "Pass",
        "Canal",
        "River",
      ])
      .optional(),

    state: z.string().trim().optional(),

    region: z.string().trim().optional(),

    sort: z
      .enum([
        "name",
        "-name",
        "createdAt",
        "-createdAt",
      ])
      .default("name"),
  });

/* =====================================================
   ID
===================================================== */

export const placeIdSchema = z.object({
  id: z.string().trim().min(1),
});

/* =====================================================
   TYPES
===================================================== */

export type CreatePlaceInput =
  z.infer<typeof createPlaceSchema>;

export type UpdatePlaceInput =
  z.infer<typeof updatePlaceSchema>;

export type PlaceQuery =
  z.infer<typeof placeQuerySchema>;

export type PlaceId =
  z.infer<typeof placeIdSchema>;