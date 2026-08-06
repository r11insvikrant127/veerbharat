// src/validations/event.ts

import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const createEventSchema = z.object({
  name: z.string().trim().min(2).max(150),

  nativeName: z
    .string()
    .trim()
    .optional()
    .default(""),

  eventDate: z.coerce.date().optional(),

  eventDateAccuracy: z
    .enum([
      "Exact",
      "Approximate",
      "Unknown",
    ])
    .optional()
    .default("Unknown"),

  locationId: objectId.optional(),

  historicalPeriodId: objectId.optional(),

  type: z.enum([
    "Coronation",
    "Birth",
    "Death",
    "Treaty",
    "Victory",
    "Defeat",
    "Hiding",
    "Prophecy",
    "Battle",
  ]),

  isOnThisDayEligible: z
    .boolean()
    .optional()
    .default(false),

  description: z
    .string()
    .trim()
    .min(10),

  significance: z
    .string()
    .trim()
    .optional()
    .default(""),

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

export const updateEventSchema =
  createEventSchema.partial();

export type CreateEventInput =
  z.infer<typeof createEventSchema>;

export type UpdateEventInput =
  z.infer<typeof updateEventSchema>;