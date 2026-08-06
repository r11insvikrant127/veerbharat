// src/validations/hero.ts

import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const createHeroSchema = z.object({
  /* BASIC */

  name: z.string().trim().min(2).max(150),

  nativeName: z.string().trim().optional().default(""),

  alternativeNames: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

  title: z.string().trim().optional().default(""),

  gender: z.enum([
    "Male",
    "Female",
    "Other",
  ]),

  birthDate: z.coerce.date().optional(),

  birthDateAccuracy: z
    .enum([
      "Exact",
      "Approximate",
      "Unknown",
    ])
    .optional()
    .default("Unknown"),

  deathDate: z.coerce.date().optional(),

  deathDateAccuracy: z
    .enum([
      "Exact",
      "Approximate",
      "Unknown",
    ])
    .optional()
    .default("Unknown"),

  birthPlaceId: objectId.optional(),

  deathPlaceId: objectId.optional(),

  causeOfDeath: z.string().trim().optional().default(""),

  nickname: z.string().trim().optional().default(""),

  personalityTraits: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

  legacy: z.string().trim().optional().default(""),

  historicalAssessments: z
    .record(z.string(), z.string())
    .optional(),

  biography: z.string().trim().min(10),

  shortDescription: z
    .string()
    .trim()
    .optional()
    .default(""),

  knownFor: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

  occupation: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

  roles: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

  languagesKnown: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

  education: z.string().trim().optional().default(""),

  religion: z.string().trim().optional().default(""),

  coronationDate: z.coerce.date().optional(),

  predecessorId: objectId.optional(),

  successorId: objectId.optional(),

  officialSeal: z.string().trim().optional().default(""),

  coins: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

  administrativeReforms: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

  economicReforms: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

  dynastyId: objectId.optional(),

  clan: z.string().trim().optional().default(""),

  /* MILITARY */

  armySize: z.number().int().positive().optional(),

  militaryTactics: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

  notableFeats: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

  rank: z.string().trim().optional().default(""),

  /* POLITICAL */

  kingdomId: objectId,

  capitalId: objectId.optional(),

  reignPeriod: z.string().trim().optional().default(""),

  historicalPeriodId: objectId.optional(),

  /* CONTENT */

  achievements: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

  sourceIds: z
    .array(objectId)
    .optional()
    .default([]),

  tags: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

  status: z
    .enum([
      "Draft",
      "Verified",
      "Published",
      "Needs Review",
    ])
    .optional()
    .default("Draft"),
});

export const updateHeroSchema =
  createHeroSchema.partial();

export type CreateHeroInput =
  z.infer<typeof createHeroSchema>;

export type UpdateHeroInput =
  z.infer<typeof updateHeroSchema>;