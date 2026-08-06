// src/services/idGenerator.service.ts

import Counter from "@/models/counter";
import { formatId } from "@/utils";
import type { IdPrefix } from "@/constants";

export async function generateNextId(
  prefix: IdPrefix
): Promise<string> {
  const counter = await Counter.findOneAndUpdate(
    { _id: prefix },
    {
      $inc: {
        sequence: 1,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  return formatId(prefix, counter.sequence);
}