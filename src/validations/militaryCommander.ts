import { z } from "zod";

import {
  objectId,
  objectIdArray,
  stringArray,
  statusEnum,
  paginationSchema,
} from "@/validations/common";

/* =====================================================
   COMMANDER ROLE
===================================================== */

export const commanderRoleEnum = z.enum([
  "Commander",
  "Officer",
  "Vassal",
  "General",
]);

/* =====================================================
   CREATE
===================================================== */

export const createMilitaryCommanderSchema = z.object({
  /* BASIC */

  name: z.string()
    .trim()
    .min(2)
    .max(200),

  title: z.string()
    .trim()
    .optional()
    .default(""),

  role: commanderRoleEnum,

  /* AFFILIATION */

  kingdomId: objectId,

  allegiance: z.string()
    .trim()
    .optional()
    .default(""),

  relationship: z.string()
    .trim()
    .optional()
    .default(""),

  /* MILITARY */

  notableBattleIds: objectIdArray,

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

      relatedSources: objectIdArray,

      relatedImages: objectIdArray,
    })
    .optional()
    .default({
      relatedHeroes: [],
      relatedKingdoms: [],
      relatedBattles: [],
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

export const updateMilitaryCommanderSchema =
  createMilitaryCommanderSchema.partial();

/* =====================================================
   QUERY
===================================================== */

export const militaryCommanderQuerySchema =
  paginationSchema.extend({
    search: z.string()
      .trim()
      .optional(),

    status: statusEnum.optional(),

    role:
      commanderRoleEnum.optional(),

    kingdomId:
      objectId.optional(),

    sort: z.enum([
      "name",
      "-name",
      "role",
      "-role",
      "createdAt",
      "-createdAt",
    ]).default("name"),
  });

/* =====================================================
   ID
===================================================== */

export const militaryCommanderIdSchema = z.object({
  id: z.string()
    .trim()
    .min(1),
});

/* =====================================================
   TYPES
===================================================== */

export type CreateMilitaryCommanderInput =
  z.infer<typeof createMilitaryCommanderSchema>;

export type UpdateMilitaryCommanderInput =
  z.infer<typeof updateMilitaryCommanderSchema>;

export type MilitaryCommanderQuery =
  z.infer<typeof militaryCommanderQuerySchema>;

export type MilitaryCommanderId =
  z.infer<typeof militaryCommanderIdSchema>;