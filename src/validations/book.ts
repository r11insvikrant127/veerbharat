// src/validations/book.ts

import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const createBookSchema = z.object({
  title: z.string().trim().min(2).max(200),

  bookType: z.enum([
    "Biography",
    "Chronicle",
    "Research",
    "Travel Account",
    "Archaeology",
    "Inscription Study",
    "Government Publication",
  ]),

  author: z.string().trim().optional().default(""),

  language: z.string().trim().optional().default(""),

  period: z.string().trim().optional().default(""),

  description: z.string().trim().min(10),

  subjects: z
    .array(z.string().trim().min(1))
    .optional()
    .default([]),

  pdfUrl: z.string().trim().url().optional(),

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

export const updateBookSchema =
  createBookSchema.partial();

export type CreateBookInput =
  z.infer<typeof createBookSchema>;

export type UpdateBookInput =
  z.infer<typeof updateBookSchema>;