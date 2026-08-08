// src/validations/common.ts

//defines reusable things

import { z } from "zod";

export const objectId = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const optionalObjectId =
  objectId.optional().nullable();

export const stringField =
  z.string().trim();

export const optionalString =
  stringField.optional().default("");

export const stringArray =
  z.array(stringField).optional().default([]);

export const dateField =
  z.coerce.date();

export const optionalDate =
  dateField.optional().nullable();

export const genderEnum = z.enum([
  "Male",
  "Female",
  "Other",
]);

export const accuracyEnum = z.enum([
  "Exact",
  "Approximate",
  "Unknown",
]);

export const statusEnum = z.enum([
  "Draft",
  "Verified",
  "Published",
  "Needs Review",
]);

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const objectIdArray = z
  .array(objectId)
  .optional()
  .default([]);