// src/validations/weapon.ts

import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const createWeaponSchema = z.object({
  name: z.string().trim().min(2).max(100),

  nativeName: z.string().trim().optional().default(""),

  category: z.enum([
    "Sword",
    "Spear",
    "Shield",
    "Bow",
    "Arrow",
    "Armour",
    "Firearm",
  ]),

  subCategory: z.string().trim().optional().default(""),

  material: z.string().trim().optional().default(""),

  weight: z.string().trim().optional().default(""),

  length: z.string().trim().optional().default(""),

  origin: z.string().trim().optional().default(""),

  effectiveRange: z.string().trim().optional().default(""),

  manufacturingMethod: z
    .string()
    .trim()
    .optional()
    .default(""),

  eraUsed: objectId.optional(),

  replicaExists: z.boolean().optional().default(false),

  specialFeatures: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

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

export const updateWeaponSchema =
  createWeaponSchema.partial();

export type CreateWeaponInput =
  z.infer<typeof createWeaponSchema>;

export type UpdateWeaponInput =
  z.infer<typeof updateWeaponSchema>;