// src/constants/collections.ts

export const COLLECTIONS = {
  HERO: "heroes",
  HISTORICAL_PERIOD: "historicalperiods",
  KINGDOM: "kingdoms",
  BATTLE: "battles",
  BOOK: "books",
  SOURCE: "sources",
  IMAGE: "images",
  DYNASTY: "dynasties",
  EVENT: "events",
  FORT: "forts",
  PLACE: "places",
  QUOTE: "quotes",
  MUSEUM: "museums",
  MEMORIAL: "memorials",
  EXHIBITION: "exhibitions",
  MILITARY_COMMANDER: "militarycommanders",
  TRIBE: "tribes",
  WAR_ANIMAL: "waranimals",
  WAR_STRATEGY: "warstrategies",
  ALLIANCE: "alliances",
  WEAPON: "weapons",
} as const;

export type CollectionName =
  (typeof COLLECTIONS)[keyof typeof COLLECTIONS];