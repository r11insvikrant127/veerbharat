import { z } from "zod";

import {
  objectId,
  objectIdArray,
  stringArray,
  statusEnum,
  paginationSchema,
} from "@/validations/common";

/* =====================================================
   WAR ANIMAL TYPE
===================================================== */

export const warAnimalTypeEnum = z.enum([
  "Horse",
  "Elephant",
  "Camel",
  "Dog",
]);

/* =====================================================
   CREATE
===================================================== */

export const createWarAnimalSchema = z.object({
  /* BASIC */

  name: z.string()
    .trim()
    .min(2)
    .max(200),

  type: warAnimalTypeEnum,

  breedSpecies: z.string()
    .trim()
    .optional()
    .default(""),

  /* OWNERSHIP */

  ownerId: objectId,

  kingdomId: objectId.optional(),

  /* DETAILS */

  specialAbilities: stringArray,

  disguiseDetails: z
    .object({
      disguise: z.string()
        .trim()
        .optional()
        .default(""),

      purpose: z.string()
        .trim()
        .optional()
        .default(""),
    })
    .optional()
    .default({
      disguise: "",
      purpose: "",
    }),

  notableBattles: objectIdArray,

  armourId: objectId.optional(),

  fate: z.string()
    .trim()
    .optional()
    .default(""),

  memorialId: objectId.optional(),

  /* CONTENT */

  description: z.string()
    .trim()
    .min(10),

  imageIds: objectIdArray,

  sourceIds: objectIdArray,

  tags: stringArray,

  /* ===================================================
     CROSS REFERENCES
  =================================================== */

  crossReferences: z
    .object({
      relatedHeroes: objectIdArray,

      relatedKingdoms: objectIdArray,

      relatedBattles: objectIdArray,

      relatedMemorials: objectIdArray,

      relatedSources: objectIdArray,

      relatedImages: objectIdArray,
    })
    .optional()
    .default({
      relatedHeroes: [],
      relatedKingdoms: [],
      relatedBattles: [],
      relatedMemorials: [],
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

export const updateWarAnimalSchema =
  createWarAnimalSchema.partial();

/* =====================================================
   QUERY
===================================================== */

export const warAnimalQuerySchema =
  paginationSchema.extend({
    search: z.string()
      .trim()
      .optional(),

    status: statusEnum.optional(),

    type:
      warAnimalTypeEnum.optional(),

    ownerId:
      objectId.optional(),

    kingdomId:
      objectId.optional(),

    armourId:
      objectId.optional(),

    memorialId:
      objectId.optional(),

    sort: z.enum([
      "name",
      "-name",
      "type",
      "-type",
      "createdAt",
      "-createdAt",
    ]).default("name"),
  });

/* =====================================================
   ID
===================================================== */

export const warAnimalIdSchema = z.object({
  id: z.string()
    .trim()
    .min(1),
});

/* =====================================================
   TYPES
===================================================== */

export type CreateWarAnimalInput =
  z.infer<typeof createWarAnimalSchema>;

export type UpdateWarAnimalInput =
  z.infer<typeof updateWarAnimalSchema>;

export type WarAnimalQuery =
  z.infer<typeof warAnimalQuerySchema>;

export type WarAnimalId =
  z.infer<typeof warAnimalIdSchema>;