// src/validations/image.ts

import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const createImageSchema = z.object({
  title: z.string().trim().min(2).max(200),

  url: z.string().trim().url(),

  altText: z.string().trim().min(2).max(300),

  imageType: z.enum([
    "Painting",
    "Portrait",
    "Photograph",
    "Statue",
    "Map",
    "Coin",
    "Weapon",
    "Inscription",
    "Fort",
    "Manuscript",
  ]),

  description: z.string().trim().optional().default(""),

  artist: z.string().trim().optional().default(""),

  period: z.string().trim().optional().default(""),

  license: z.string().trim().optional().default(""),

  copyright: z.string().trim().optional().default(""),

  photographer: z.string().trim().optional().default(""),

  painting: z.boolean().optional().default(false),

  aiGenerated: z.boolean().optional().default(false),

  restored: z.boolean().optional().default(false),

  yearCreated: z.string().trim().optional().default(""),

  sourceId: objectId.optional(),

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

export const updateImageSchema =
  createImageSchema.partial();

export type CreateImageInput =
  z.infer<typeof createImageSchema>;

export type UpdateImageInput =
  z.infer<typeof updateImageSchema>;