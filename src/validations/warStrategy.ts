// src/validations/warStrategy.ts

import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const createWarStrategySchema = z.object({
  name: z.string().trim().min(2).max(100),

  nativeName: z.string().trim().optional().default(""),

  type: z.enum([
    "Guerrilla",
    "Conventional",
    "Terrain-based",
    "Deception",
    "Psychological",
  ]),

  keyPrinciples: z
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

export const updateWarStrategySchema =
  createWarStrategySchema.partial();

export type CreateWarStrategyInput =
  z.infer<typeof createWarStrategySchema>;

export type UpdateWarStrategyInput =
  z.infer<typeof updateWarStrategySchema>;