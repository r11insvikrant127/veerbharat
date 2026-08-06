// src/validations/warAnimal.ts

import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const createWarAnimalSchema = z.object({
  name: z.string().trim().min(2).max(100),

  type: z.enum([
    "Horse",
    "Elephant",
    "Camel",
    "Dog",
  ]),

  breedSpecies: z.string().trim().optional().default(""),

  ownerId: objectId,

  kingdomId: objectId.optional(),

  specialAbilities: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

  disguiseDetails: z
  .object({
    disguise: z.string().trim().optional().default(""),
    purpose: z.string().trim().optional().default(""),
  })
  .optional(),

  armourId: objectId.optional(),

  fate: z.string().trim().optional().default(""),

  description: z.string().trim().min(10),

  sourceIds: z
    .array(objectId)
    .min(1, "At least one source is required"),

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

export const updateWarAnimalSchema =
  createWarAnimalSchema.partial();

export type CreateWarAnimalInput =
  z.infer<typeof createWarAnimalSchema>;

export type UpdateWarAnimalInput =
  z.infer<typeof updateWarAnimalSchema>;