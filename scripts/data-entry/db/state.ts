import mongoose from "mongoose";
import { getIdConfig, type IdConfig } from "../config/idConfig";

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

export type DatabaseIdState = {
  entityType: string;
  collection: string;
  field: string;
  prefix: string;
  padding: number;
  counterKey: string;
  documentCount: number;
  highestNumber: number;
  highestId: string | null;
  nextNumber: number;
  nextId: string;
  counterValue: number | null;
  counterStatus:
    | "MATCH"
    | "COUNTER_BEHIND"
    | "COUNTER_AHEAD"
    | "NO_COUNTER"
    | "EMPTY_COLLECTION";
};

function formatId(
  prefix: string,
  number: number,
  padding: number
): string {
  return `${prefix}${String(number).padStart(
    padding,
    "0"
  )}`;
}

export async function inspectIdState(
  entityType: string
): Promise<DatabaseIdState> {
  const config: IdConfig =
    getIdConfig(entityType);

  const db = getDatabase();

  const collection = db.collection(
    config.collection
  );

  const documents = await collection
    .find(
      {},
      {
        projection: {
          [config.field]: 1,
        },
      }
    )
    .toArray();

  let highestNumber = 0;
  let highestId: string | null = null;

  for (const document of documents) {
    const value =
      document[config.field];

    if (typeof value !== "string") {
      continue;
    }

    /*
     * Only IDs beginning with the configured prefix
     * participate in numeric allocation.
     *
     * This protects special image IDs such as:
     * IMG-EVT060-MAP01
     * IMGTEST001
     */
    if (!value.startsWith(config.prefix)) {
      continue;
    }

    const match = value.match(
      new RegExp(
        `^${config.prefix}(\\d+)$`
      )
    );

    if (!match) {
      continue;
    }

    const number = Number(match[1]);

    if (
      Number.isSafeInteger(number) &&
      number > highestNumber
    ) {
      highestNumber = number;
      highestId = value;
    }
  }

  const counters =
    db.collection<CounterDocument>(
      "counters"
    );

  const counterDocument =
    await counters.findOne({
      _id: config.counterKey,
    });

  const counterValue =
    counterDocument &&
    typeof counterDocument.sequence === "number"
      ? counterDocument.sequence
      : null;

  let counterStatus: DatabaseIdState["counterStatus"];

  if (documents.length === 0) {
    counterStatus = "EMPTY_COLLECTION";
  } else if (counterValue === null) {
    counterStatus = "NO_COUNTER";
  } else if (counterValue < highestNumber) {
    counterStatus = "COUNTER_BEHIND";
  } else if (counterValue > highestNumber) {
    counterStatus = "COUNTER_AHEAD";
  } else {
    counterStatus = "MATCH";
  }

  const nextNumber = highestNumber + 1;

  return {
    entityType,
    collection: config.collection,
    field: config.field,
    prefix: config.prefix,
    padding: config.padding,
    counterKey: config.counterKey,
    documentCount: documents.length,
    highestNumber,
    highestId,
    nextNumber,
    nextId: formatId(
      config.prefix,
      nextNumber,
      config.padding
    ),
    counterValue,
    counterStatus,
  };
}
