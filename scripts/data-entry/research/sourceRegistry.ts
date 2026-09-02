/*
 * scripts/data-entry/research/sourceRegistry.ts
 *
 * Registry of public research sources used by VeerBharat.
 *
 * IMPORTANT:
 * - No source is automatically considered historically correct.
 * - Source authority is used for ranking and verification.
 * - Regional sources are optional and are selected only when relevant.
 */

export type SourceAuthority =
  | "primary"
  | "government"
  | "academic"
  | "institutional"
  | "encyclopedia"
  | "community"
  | "unknown";

export type SourceKind =
  | "api"
  | "website"
  | "archive"
  | "book"
  | "publication"
  | "encyclopedia"
  | "database";

export type ResearchSourceDefinition = {
  id: string;

  name: string;

  authority: SourceAuthority;

  kind: SourceKind;

  baseUrl: string;

  enabled: boolean;

  /*
   * Optional geographical relevance.
   *
   * These are hints only.
   * They do NOT restrict a source from being
   * used when it is clearly relevant.
   */
  regions: string[];

  /*
   * Optional subject hints.
   *
   * Example:
   * - freedom movement
   * - Bengal
   * - Maharashtra
   * - Assam
   */
  subjects: string[];

  /*
   * Relative source weight used during verification.
   *
   * This is NOT a probability of truth.
   */
  authorityWeight: number;

  description: string;
};

/*
 * ------------------------------------------------------------
 * SOURCE REGISTRY
 * ------------------------------------------------------------
 *
 * The registry intentionally contains broad source categories.
 *
 * Regional sources such as Banglapedia are NOT treated as
 * universal sources.
 */

export const RESEARCH_SOURCES: ResearchSourceDefinition[] = [
  {
    id: "wikipedia",

    name: "Wikipedia",

    authority: "encyclopedia",

    kind: "api",

    baseUrl:
      "https://en.wikipedia.org",

    enabled: true,

    regions: [
      "global",
    ],

    subjects: [
      "general history",
      "biography",
      "events",
      "places",
    ],

    authorityWeight: 0.70,

    description:
      "Useful secondary encyclopedia for broad discovery, references, names, dates and relationships.",
  },

  {
    id: "wikidata",

    name: "Wikidata",

    authority: "encyclopedia",

    kind: "api",

    baseUrl:
      "https://www.wikidata.org",

    enabled: true,

    regions: [
      "global",
    ],

    subjects: [
      "biography",
      "dates",
      "places",
      "people",
      "events",
      "relationships",
    ],

    authorityWeight: 0.75,

    description:
      "Structured knowledge database useful for dates, identifiers, places and relationships.",
  },

  {
    id: "dictionary_of_martyrs",

    name: "Dictionary of Martyrs: India's Freedom Struggle",

    authority: "government",

    kind: "publication",

    baseUrl:
      "https://culture.gov.in",

    enabled: true,

    regions: [
      "india",
    ],

    subjects: [
      "indian independence movement",
      "freedom struggle",
      "martyrs",
      "heroes",
    ],

    authorityWeight: 1.00,

    description:
      "Government of India historical publication covering India's freedom struggle and martyrs.",
  },

  {
    id: "ministry_of_culture",

    name: "Ministry of Culture, Government of India",

    authority: "government",

    kind: "website",

    baseUrl:
      "https://culture.gov.in",

    enabled: true,

    regions: [
      "india",
    ],

    subjects: [
      "indian history",
      "freedom struggle",
      "heritage",
      "historical personalities",
      "historical events",
    ],

    authorityWeight: 1.00,

    description:
      "Official Government of India source for culture, heritage and historical material.",
  },

  {
    id: "pib",

    name: "Press Information Bureau, Government of India",

    authority: "government",

    kind: "website",

    baseUrl:
      "https://www.pib.gov.in",

    enabled: true,

    regions: [
      "india",
    ],

    subjects: [
      "indian independence movement",
      "freedom fighters",
      "historical events",
      "government commemorations",
    ],

    authorityWeight: 0.95,

    description:
      "Official Government of India information source containing historical and commemorative material.",
  },

  {
    id: "national_archives_india",

    name: "National Archives of India",

    authority: "primary",

    kind: "archive",

    baseUrl:
      "https://www.nationalarchives.nic.in",

    enabled: true,

    regions: [
      "india",
    ],

    subjects: [
      "primary sources",
      "colonial india",
      "indian independence movement",
      "government records",
      "historical documents",
    ],

    authorityWeight: 1.00,

    description:
      "National archival institution containing historical government records and primary-source material.",
  },

  {
    id: "academic",

    name: "Academic and University Sources",

    authority: "academic",

    kind: "publication",

    baseUrl:
      "https://www.google.com",

    enabled: true,

    regions: [
      "global",
    ],

    subjects: [
      "history",
      "biography",
      "historical research",
      "academic publications",
    ],

    authorityWeight: 0.90,

    description:
      "Placeholder registry entry for discovering relevant university and academic publications.",
  },

  {
    id: "banglapedia",

    name: "Banglapedia",

    authority: "encyclopedia",

    kind: "encyclopedia",

    baseUrl:
      "https://en.banglapedia.org",

    enabled: true,

    regions: [
      "bengal",
      "bangladesh",
      "eastern_india",
    ],

    subjects: [
      "bengal history",
      "bangladesh history",
      "bengali personalities",
      "regional history",
    ],

    authorityWeight: 0.85,

    description:
      "Regional historical encyclopedia. Use only when the entity or subject is relevant to its geographical coverage.",
  },
];

/*
 * ------------------------------------------------------------
 * ENABLED SOURCES
 * ------------------------------------------------------------
 */

export function getEnabledResearchSources():
  ResearchSourceDefinition[] {
  return RESEARCH_SOURCES.filter(
    (source) => source.enabled
  );
}

/*
 * ------------------------------------------------------------
 * SOURCE LOOKUP
 * ------------------------------------------------------------
 */

export function getResearchSource(
  id: string
): ResearchSourceDefinition | null {
  return (
    RESEARCH_SOURCES.find(
      (source) =>
        source.id === id
    ) ?? null
  );
}

/*
 * ------------------------------------------------------------
 * AUTHORITY WEIGHT
 * ------------------------------------------------------------
 */

export function getSourceAuthorityWeight(
  source: ResearchSourceDefinition
): number {
  return source.authorityWeight;
}

/*
 * ------------------------------------------------------------
 * REGISTRY VALIDATION
 * ------------------------------------------------------------
 */

export function validateSourceRegistry(): void {
  const ids =
    new Set<string>();

  for (
    const source of RESEARCH_SOURCES
  ) {
    if (!source.id.trim()) {
      throw new Error(
        "Research source ID cannot be empty."
      );
    }

    if (
      ids.has(source.id)
    ) {
      throw new Error(
        `Duplicate research source ID: ${source.id}`
      );
    }

    ids.add(
      source.id
    );

    if (
      !source.name.trim()
    ) {
      throw new Error(
        `Research source name cannot be empty: ${source.id}`
      );
    }

    if (
      !source.baseUrl.trim()
    ) {
      throw new Error(
        `Research source URL cannot be empty: ${source.id}`
      );
    }

    if (
      source.authorityWeight < 0 ||
      source.authorityWeight > 1
    ) {
      throw new Error(
        `Invalid authority weight for source: ${source.id}`
      );
    }
  }
}

/*
 * Validate the registry as soon as this module loads.
 */
validateSourceRegistry();