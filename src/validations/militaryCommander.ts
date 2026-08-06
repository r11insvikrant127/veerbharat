// src/validations/militaryCommander.ts

import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const createMilitaryCommanderSchema = z.object({
  name: z.string().trim().min(2).max(100),

  title: z.string().trim().optional().default(""),

  role: z.enum([
    "Commander",
    "Officer",
    "Vassal",
    "General",
  ]),

  kingdomId: objectId,

  allegiance: z
    .string()
    .trim()
    .optional()
    .default(""),

  relationship: z
    .string()
    .trim()
    .optional()
    .default(""),

  description: z
    .string()
    .trim()
    .min(10),

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

export const updateMilitaryCommanderSchema =
  createMilitaryCommanderSchema.partial();

export type CreateMilitaryCommanderInput =
  z.infer<typeof createMilitaryCommanderSchema>;

export type UpdateMilitaryCommanderInput =
  z.infer<typeof updateMilitaryCommanderSchema>;