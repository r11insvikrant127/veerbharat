import { z } from "zod";

import {
  objectId,
  objectIdArray,
  stringArray,
  statusEnum,
  accuracyEnum,
  paginationSchema,
} from "@/validations/common";

/* =====================================================
   CREATE
===================================================== */

export const createBattleSchema = z.object({
  /* BASIC */

  name: z.string().trim().min(2).max(150),

  nativeName: z.string().trim().optional().default(""),

  alternativeNames: stringArray,

  battleDate: z.coerce.date().nullable().optional(),

  battleDateAccuracy: accuracyEnum
    .optional()
    .default("Unknown"),

  /* LOCATION */

  locationId: objectId,

  historicalPeriodId: objectId.optional(),

  /* PARTICIPANTS */

  kingdomIds: objectIdArray,

  commanderIds: objectIdArray,

  opposingCommanderIds: objectIdArray,

  victorId: objectId.optional(),

  victorModel: z
    .enum(["Hero", "Kingdom"])
    .optional(),

  /* MILITARY */

  casualties: z.number().int().min(0).optional(),

  armySizes: z
    .record(z.string(), z.number())
    .optional()
    .default({}),

  weaponsUsed: objectIdArray,

  warAnimalIds: objectIdArray,

  strategyId: objectId.optional(),

  keyEvents: stringArray,

  /* CONTENT */

  significance: z.string().trim().optional().default(""),

  description: z.string().trim().min(10),

  aftermath: z.string().trim().optional().default(""),

  imageIds: objectIdArray,

  sourceIds: objectIdArray,

  tags: stringArray,

  /* CROSS REFERENCES */

  crossReferences: z
    .object({
      relatedHeroes: objectIdArray,

      relatedKingdoms: objectIdArray,

      relatedWeapons: objectIdArray,

      relatedPlaces: objectIdArray,

      relatedEvents: objectIdArray,

      relatedBooks: objectIdArray,

      relatedSources: objectIdArray,

      relatedImages: objectIdArray,
    })
    .optional()
    .default({
      relatedHeroes: [],
      relatedKingdoms: [],
      relatedWeapons: [],
      relatedPlaces: [],
      relatedEvents: [],
      relatedBooks: [],
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

  status: statusEnum.optional().default("Draft"),
});

/* =====================================================
   UPDATE
===================================================== */

export const updateBattleSchema =
  createBattleSchema.partial();

/* =====================================================
   QUERY
===================================================== */

export const battleQuerySchema =
  paginationSchema.extend({
    search: z.string().trim().optional(),

    status: statusEnum.optional(),

    historicalPeriodId: objectId.optional(),

    locationId: objectId.optional(),

    sort: z
      .enum([
        "name",
        "-name",
        "createdAt",
        "-createdAt",
        "battleDate",
        "-battleDate",
      ])
      .default("name"),
  });

/* =====================================================
   ID
===================================================== */

export const battleIdSchema =
  z.object({
    id: z.string().trim().min(1),
  });

/* =====================================================
   TYPES
===================================================== */

export type CreateBattleInput =
  z.infer<typeof createBattleSchema>;

export type UpdateBattleInput =
  z.infer<typeof updateBattleSchema>;

export type BattleQuery =
  z.infer<typeof battleQuerySchema>;

export type BattleId =
  z.infer<typeof battleIdSchema>;