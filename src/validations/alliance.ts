import { z } from "zod";

import {
  objectIdArray,
  stringArray,
  statusEnum,
  paginationSchema,
} from "@/validations/common";

/* =====================================================
   ALLIANCE TYPE
===================================================== */

export const allianceTypeEnum = z.enum([
  "Military",
  "Tribal",
  "Family",
  "Political",
]);

/* =====================================================
   PARTY MODEL
===================================================== */

export const partyModelEnum = z.enum([
  "Hero",
  "Tribe",
]);

/* =====================================================
   CREATE
===================================================== */

export const createAllianceSchema = z.object({
  /* BASIC */

  name: z.string()
    .trim()
    .min(2)
    .max(250),

  type: allianceTypeEnum,

  /* PARTIES */

  parties: objectIdArray,

  partyModel:
    partyModelEnum.optional(),

  /* CONTENT */

  description: z.string()
    .trim()
    .min(10),

  notableContributions: stringArray,

  sourceIds: objectIdArray,

  tags: stringArray,

  /* ===================================================
     CROSS REFERENCES
  =================================================== */

  crossReferences: z
    .object({
      relatedHeroes: objectIdArray,

      relatedTribes: objectIdArray,

      relatedSources: objectIdArray,
    })
    .optional()
    .default({
      relatedHeroes: [],
      relatedTribes: [],
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

export const updateAllianceSchema =
  createAllianceSchema.partial();

/* =====================================================
   QUERY
===================================================== */

export const allianceQuerySchema =
  paginationSchema.extend({
    search: z.string()
      .trim()
      .optional(),

    status: statusEnum.optional(),

    type:
      allianceTypeEnum.optional(),

    partyModel:
      partyModelEnum.optional(),

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

export const allianceIdSchema = z.object({
  id: z.string()
    .trim()
    .min(1),
});

/* =====================================================
   TYPES
===================================================== */

export type CreateAllianceInput =
  z.infer<typeof createAllianceSchema>;

export type UpdateAllianceInput =
  z.infer<typeof updateAllianceSchema>;

export type AllianceQuery =
  z.infer<typeof allianceQuerySchema>;

export type AllianceId =
  z.infer<typeof allianceIdSchema>;