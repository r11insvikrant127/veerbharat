// src/validations/source.ts

import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const createSourceSchema = z.object({
  title: z.string().trim().min(2).max(200),

  type: z.enum([
    "Book",
    "Research Paper",
    "Government Record",
    "ASI",
    "Museum",
    "Archive",
    "Inscription",
    "Travel Account",
    "Chronicle",
    "Manuscript",
  ]),

  author: z.string().trim().optional().default(""),

  language: z.string().trim().optional().default(""),

  year: z.string().trim().optional().default(""),

  publisher: z.string().trim().optional().default(""),

  edition: z.string().trim().optional().default(""),

  isbn: z.string().trim().optional().default(""),

  pages: z.number().int().positive().optional(),

  volume: z.string().trim().optional().default(""),

  publicationYear: z.string().trim().optional().default(""),

  description: z.string().trim().min(10),

  reliability: z
    .enum(["High", "Medium", "Low"])
    .optional()
    .default("Medium"),

  location: z.string().trim().optional().default(""),

  url: z.string().trim().url().optional(),

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

export const updateSourceSchema =
  createSourceSchema.partial();

export type CreateSourceInput =
  z.infer<typeof createSourceSchema>;

export type UpdateSourceInput =
  z.infer<typeof updateSourceSchema>;