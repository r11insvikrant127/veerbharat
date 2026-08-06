// src/utils/formatId.ts
//Convert a prefix and a number into a formatted ID.
//e.g. formatId("HERO", 1).......HERO0001

import type { IdPrefix } from "@/constants";

const DEFAULT_PADDING = 4;

export function formatId(
  prefix: IdPrefix,
  sequence: number,
  padding: number = DEFAULT_PADDING
): string {
  return `${prefix}${sequence.toString().padStart(padding, "0")}`;
}