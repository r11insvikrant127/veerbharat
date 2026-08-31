import mongoose from "mongoose";

import { formatId } from "../../../src/utils/formatId";
import type { IdPrefix } from "../../../src/constants";

import {
  findOne,
  collection,
} from "./repository";

type CounterDocument = {
  _id: string;
  sequence: number;
};

function getDatabase() {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error(
      "MongoDB database is not connected."
    );
  }

  return db;
}

/**
 * Allocate the next ID for an entity.
 *
 * This operation is atomic.
 *
 * Example:
 *
 * current HERO counter = 83
 *
 * allocateNextId("HERO")
 *
 * => HERO0084
 */
export async function allocateNextId(
  prefix: IdPrefix
): Promise<string> {
  const db = getDatabase();

  const counters =
    db.collection<CounterDocument>(
      "counters"
    );

  const result =
    await counters.findOneAndUpdate(
      {
        _id: prefix,
      },
      {
        $inc: {
          sequence: 1,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

  if (!result) {
    throw new Error(
      `Unable to allocate ID for prefix "${prefix}".`
    );
  }

  return formatId(
    prefix,
    result.sequence
  );
}

/**
 * Read the current counter without modifying it.
 */
export async function getCounter(
  prefix: string
): Promise<number> {
  const counter =
    await findOne<CounterDocument>(
      "counters",
      {
        _id: prefix,
      }
    );

  return counter?.sequence ?? 0;
}

/**
 * Manually set a counter.
 *
 * Used only for maintenance/repair.
 *
 * Normal data entry should use allocateNextId().
 */
export async function setCounter(
  prefix: string,
  sequence: number
): Promise<void> {
  if (!Number.isInteger(sequence)) {
    throw new Error(
      "Counter sequence must be an integer."
    );
  }

  const counters =
    collection<CounterDocument>(
      "counters"
    );

  await counters.updateOne(
    {
      _id: prefix,
    },
    {
      $set: {
        sequence,
      },
    },
    {
      upsert: true,
    }
  );
}