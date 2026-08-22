// src/validations/hero.ts

import { z } from "zod";

import {
  objectId,
  objectIdArray,
  stringArray,
  statusEnum,
  genderEnum,
  accuracyEnum,
  paginationSchema,
} from "@/validations/common";

export const createHeroSchema = z.object({
  /* BASIC */

  name: z.string().trim().min(2).max(150),

  nativeName: z.string().trim().optional().default(""),

  alternativeNames: stringArray,

  title: z.string().trim().optional().default(""),

  gender: genderEnum,

  birthDate: z.coerce.date().nullable().optional(),

  birthDateAccuracy: accuracyEnum
  .optional()
  .default("Unknown"),

  deathDate: z.coerce.date().nullable().optional(),

  deathDateAccuracy: accuracyEnum
  .optional()
  .default("Unknown"),

  birthPlaceId: objectId.optional(),

  deathPlaceId: objectId.optional(),

  causeOfDeath: z.string().trim().optional().default(""),

  nickname: z.string().trim().optional().default(""),

  personalityTraits: stringArray,

  legacy: z.string().trim().optional().default(""),

  historicalAssessments: z
    .record(z.string(), z.string())
    .optional()
    .default({}),

  biography: z.string().trim().min(10),

  shortDescription: z
    .string()
    .trim()
    .optional()
    .default(""),

  knownFor: stringArray,

  occupation: stringArray,

  roles: stringArray,

  languagesKnown: stringArray,

  education: stringArray,

  religion: z.string().trim().optional().default(""),

  coronationDate: z.coerce.date().optional().nullable(),

  predecessorId: objectId.optional(),

  successorId: objectId.optional(),

  officialSeal: z.string().trim().optional().default(""),

  coins: stringArray,

  administrativeReforms: stringArray,

  economicReforms: stringArray,

  dynastyId: objectId.optional(),

  clan: z.string().trim().optional().default(""),
  /* FAMILY */

  fatherId: objectId.optional(),

  motherId: objectId.optional(),

  brothers: objectIdArray,

  sisters: objectIdArray,

  spouseIds: objectIdArray,

  childrenIds: objectIdArray,

  /* MILITARY */

  primaryWeaponIds: objectIdArray,

  preferredWeapons: objectIdArray,

  warAnimalId: objectId.optional(),

  armySize: z.number().int().positive().optional(),

  commanderOf: objectIdArray,

  warStrategyIds: objectIdArray,

  militaryTactics: stringArray,

  notableFeats: stringArray,

  rank: z.string().trim().optional().default(""),

  /* POLITICAL */

  kingdomId: objectId,

  capitalId: objectId.optional(),

  reignPeriod: z
    .string()
    .trim()
    .optional()
    .default(""),

  territoryControlled: objectIdArray,

  territoriesLost: objectIdArray,

  territoriesRecaptured: objectIdArray,

  historicalPeriodId: objectId.optional(),

  /* CROSS REFERENCES */

  relatedHeroes: objectIdArray,

  relatedBattles: objectIdArray,

  relatedPlaces: objectIdArray,

  relatedBooks: objectIdArray,

  relatedSources: objectIdArray,

  relatedImages: objectIdArray,

  /* CONTENT */

  achievements: stringArray,

  quoteIds: objectIdArray,

  imageIds: objectIdArray,

  museumId: objectId.optional(),

  exhibitionIds: objectIdArray,

  memorialId: objectId.optional(),

  bookIds: objectIdArray,

  sourceIds: objectIdArray,

  tags: stringArray,

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
      createdBy: z
        .string()
        .trim()
        .optional()
        .default(""),

      verifiedBy: z
        .string()
        .trim()
        .optional()
        .default(""),

      version: z
        .number()
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

  status: statusEnum
  .optional()
  .default("Draft"),
});

export const updateHeroSchema =
  createHeroSchema.partial();

export const heroQuerySchema =
  paginationSchema.extend({
    search: z.string().trim().optional(),

    status: statusEnum.optional(),

    kingdomId: objectId.optional(),

    historicalPeriodId: objectId.optional(),

    gender: genderEnum.optional(),

    sort: z
      .enum([
        "name",
        "-name",
        "createdAt",
        "-createdAt",
        "birthDate",
        "-birthDate",
      ])
      .default("name"),
  });


export type CreateHeroInput = z.infer<typeof createHeroSchema>;

export type UpdateHeroInput = z.infer<typeof updateHeroSchema>;

export type HeroQuery = z.infer<typeof heroQuerySchema>;

export const heroIdSchema = z.object({id: z.string().trim().min(1),});

export type HeroId = z.infer<typeof heroIdSchema>;
