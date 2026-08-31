export type IdConfig = {
  collection: string;
  field: string;
  prefix: string;
  padding: number;
  counterKey: string;
};

export const ID_CONFIGS: Record<string, IdConfig> = {
  hero: {
    collection: "heroes",
    field: "heroId",
    prefix: "HER",
    padding: 4,
    counterKey: "HERO",
  },

  event: {
    collection: "events",
    field: "eventId",
    prefix: "EVT",
    padding: 6,
    counterKey: "EVT",
  },

  battle: {
    collection: "battles",
    field: "battleId",
    prefix: "BTL",
    padding: 4,
    counterKey: "BTL",
  },

  kingdom: {
    collection: "kingdoms",
    field: "kingdomId",
    prefix: "KNG",
    padding: 6,
    counterKey: "KNG",
  },

  source: {
    collection: "sources",
    field: "sourceId",
    prefix: "SRC",
    padding: 4,
    counterKey: "SRC",
  },

  image: {
    collection: "images",
    field: "imageId",
    prefix: "IMG",
    padding: 4,
    counterKey: "IMG",
  },

  place: {
    collection: "places",
    field: "placeId",
    prefix: "PLC",
    padding: 4,
    counterKey: "PLC",
  },

  quote: {
    collection: "quotes",
    field: "quoteId",
    prefix: "QTE",
    padding: 4,
    counterKey: "QTE",
  },

  book: {
    collection: "books",
    field: "bookId",
    prefix: "BOOK",
    padding: 4,
    counterKey: "BOOK",
  },

  historicalPersonality: {
    collection: "historicalpersonalities",
    field: "historicalPersonalityId",
    prefix: "HP",
    padding: 4,
    counterKey: "HP",
  },

  historicalPeriod: {
    collection: "historicalperiods",
    field: "periodId",
    prefix: "PER",
    padding: 4,
    counterKey: "PER",
  },
};

export function getIdConfig(entityType: string): IdConfig {
  const config = ID_CONFIGS[entityType];

  if (!config) {
    throw new Error(`Unknown entity type: ${entityType}`);
  }

  return config;
}
