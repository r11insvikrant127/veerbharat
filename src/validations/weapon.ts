import { z } from "zod";

import {
  objectId,
  objectIdArray,
  stringArray,
  statusEnum,
  paginationSchema,
} from "@/validations/common";

/* =====================================================
   WEAPON CATEGORY
===================================================== */

export const weaponCategoryEnum = z.enum([
  "Sword",
  "Spear",
  "Shield",
  "Bow",
  "Arrow",
  "Armour",
  "Firearm",
]);

/* =====================================================
   CREATE
===================================================== */

export const createWeaponSchema = z.object({
  /* BASIC */

  name: z.string()
    .trim()
    .min(2)
    .max(200),

  nativeName: z.string()
    .trim()
    .optional()
    .default(""),

  category: weaponCategoryEnum,

  subCategory: z.string()
    .trim()
    .optional()
    .default(""),

  /* PHYSICAL DETAILS */

  material: z.string()
    .trim()
    .optional()
    .default(""),

  weight: z.string()
    .trim()
    .optional()
    .default(""),

  length: z.string()
    .trim()
    .optional()
    .default(""),

  origin: z.string()
    .trim()
    .optional()
    .default(""),

  effectiveRange: z.string()
    .trim()
    .optional()
    .default(""),

  manufacturingMethod: z.string()
    .trim()
    .optional()
    .default(""),

  eraUsed: objectId.optional(),

  replicaExists: z.boolean()
    .optional()
    .default(false),

  /* RELATIONSHIPS */

  museumAvailability:
    objectIdArray,

  associatedHeroes:
    objectIdArray,

  associatedKingdoms:
    objectIdArray,

  usedInBattles:
    objectIdArray,

  specialFeatures:
    stringArray,

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

export const updateWeaponSchema =
  createWeaponSchema.partial();

/* =====================================================
   QUERY
===================================================== */

export const weaponQuerySchema =
  paginationSchema.extend({
    search: z.string()
      .trim()
      .optional(),

    status: statusEnum.optional(),

    category:
      weaponCategoryEnum.optional(),

    eraUsed:
      objectId.optional(),

    replicaExists:
      z.coerce.boolean().optional(),

    sort: z.enum([
      "name",
      "-name",
      "category",
      "-category",
      "createdAt",
      "-createdAt",
    ]).default("name"),
  });

/* =====================================================
   ID
===================================================== */

export const weaponIdSchema = z.object({
  id: z.string()
    .trim()
    .min(1),
});

/* =====================================================
   TYPES
===================================================== */

export type CreateWeaponInput =
  z.infer<typeof createWeaponSchema>;

export type UpdateWeaponInput =
  z.infer<typeof updateWeaponSchema>;

export type WeaponQuery =
  z.infer<typeof weaponQuerySchema>;

export type WeaponId =
  z.infer<typeof weaponIdSchema>;