// src/validations/alliance.ts

import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const createAllianceSchema = z.object({
  name: z.string().trim().min(2).max(100),

  type: z.enum([
    "Military",
    "Tribal",
    "Family",
    "Political",
  ]),

  partyModel: z
    .enum(["Hero", "Tribe"])
    .optional(),

  parties: z
    .array(objectId)
    .optional()
    .default([]),

  description: z.string().trim().min(10),

  notableContributions: z
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

export const updateAllianceSchema =
  createAllianceSchema.partial();

export type CreateAllianceInput =
  z.infer<typeof createAllianceSchema>;

export type UpdateAllianceInput =
  z.infer<typeof updateAllianceSchema>;