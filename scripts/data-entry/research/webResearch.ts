import axios from "axios";

import type {
  EntityType,
} from "../db/entityInput";

export type ResearchSource = {
  title: string;
  url: string;
  publisher?: string | null;
  accessedAt: string;
};

export type WebResearchResult = {
  entityType: EntityType;
  entityName: string;

  summary: string | null;

  eventDate: string | null;

  birthDate: string | null;
  deathDate: string | null;

  kingdoms: string[];
  places: string[];
  battles: string[];

  historicalEvents: string[];

  sources: ResearchSource[];

  researchCompleted: boolean;

  researchNote: string;
};

export type WebResearchFinding = {
  field:
    | "name"
    | "eventDate"
    | "birthDate"
    | "deathDate"
    | "kingdom"
    | "place"
    | "battle"
    | "summary"
    | "other";

  value: string;

  source: ResearchSource;
};

export type WebResearchFindings = {
  entityType: EntityType;
  entityName: string;

  findings: WebResearchFinding[];

  completed: boolean;
};

type WikipediaSearchPage = {
  id?: number;
  key?: string;
  title?: string;
  excerpt?: string;
  description?: string | null;
};

type WikipediaSearchResponse = {
  pages?: WikipediaSearchPage[];
};

type WikipediaPageResponse = {
  title?: string;
  source?: string;
  html?: string;
};

type WikidataSearchResponse = {
  search?: Array<{
    id: string;
    label?: string;
    description?: string;
  }>;
};

type WikidataEntityResponse = {
  entities?: Record<
    string,
    {
      claims?: Record<
        string,
        Array<{
          mainsnak?: {
            datavalue?: {
              value?: unknown;
            };
          };
        }>
      >;
    }
  >;
};

const WIKIPEDIA_API =
  "https://en.wikipedia.org/w/rest.php/v1";

const WIKIDATA_API =
  "https://www.wikidata.org/w/api.php";

const USER_AGENT =
  "VeerBharat/1.0 historical-research-tool";

function source(
  title: string,
  url: string,
  publisher: string = "Wikimedia"
): ResearchSource {
  return {
    title: title.trim(),
    url: url.trim(),
    publisher,
    accessedAt: new Date().toISOString(),
  };
}

/*
 * ============================================================
 * BASIC TEXT CLEANING
 * ============================================================
 */

function cleanBasicText(
  value: string
): string {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

/*
 * ============================================================
 * WIKIPEDIA MARKUP CLEANER
 * ============================================================
 */

function cleanWikipediaText(
  value: string
): string {
  let text = value;

  // Remove comments
  text = text.replace(
    /<!--[\s\S]*?-->/g,
    ""
  );

  // Remove references
  text = text.replace(
    /<ref[\s\S]*?<\/ref>/gi,
    ""
  );

  text = text.replace(
    /<ref[^>]*\/>/gi,
    ""
  );

  // Remove HTML tags
  text = text.replace(
    /<[^>]*>/g,
    ""
  );

  // Remove image/file blocks
  text = text.replace(
    /\[\[(?:File|Image):[\s\S]*?\]\]/gi,
    ""
  );

  // Remove category links
  text = text.replace(
    /\[\[Category:[^\]]+\]\]/gi,
    ""
  );

  // Remove templates (repeat for nested templates)
  for (let i = 0; i < 20; i++) {
    const cleaned =
      text.replace(
        /\{\{[^{}]*\}\}/g,
        ""
      );

    if (cleaned === text) {
      break;
    }

    text = cleaned;
  }

  // Convert wiki links: [[Target|Display]] -> Display, [[Target]] -> Target
  for (let i = 0; i < 10; i++) {
    const before = text;

    text = text.replace(
      /\[\[([^\[\]]+)\|([^\[\]]+)\]\]/g,
      "$2"
    );

    text = text.replace(
      /\[\[([^\[\]]+)\]\]/g,
      "$1"
    );

    if (before === text) {
      break;
    }
  }

  // Remove external links while preserving display text
  text = text.replace(
    /\[(?:https?:\/\/)[^\s\]]+\s+([^\]]+)\]/gi,
    "$1"
  );

  // Remove remaining URLs
  text = text.replace(
    /https?:\/\/\S+/gi,
    ""
  );

  // Remove bold / italic markup
  text = text.replace(
    /'''/g,
    ""
  );

  text = text.replace(
    /''/g,
    ""
  );

  // Remove section heading markup but keep heading text
  text = text.replace(
    /^={2,6}\s*(.*?)\s*={2,6}\s*$/gm,
    "\n$1\n"
  );

  // Remove list markers
  text = text.replace(
    /^\s*[*#;:]+\s*/gm,
    ""
  );

  // Remove table markup
  text = text.replace(
    /^\s*\{\|[\s\S]*?\|\}\s*$/gm,
    ""
  );

  text = text.replace(
    /^\s*\|.*$/gm,
    ""
  );

  // Remove leftover MediaWiki artifacts
  text = text.replace(
    /\b(?:File|Image|Category):[^\s]+/gi,
    ""
  );

  // Remove citation numbers
  text = text.replace(
    /\[\d+(?:\s*,\s*\d+)*\]/g,
    ""
  );

  // Remove leftover brackets
  text = text.replace(
    /\[\[/g,
    ""
  );

  text = text.replace(
    /\]\]/g,
    ""
  );

  // Remove stray pipe characters
  text = text.replace(
    /\s*\|\s*/g,
    " "
  );

  // Normalize spaces and blank lines
  text = text.replace(
    /[ \t]+/g,
    " "
  );

  text = text.replace(
    / *\n */g,
    "\n"
  );

  text = text.replace(
    /\n{3,}/g,
    "\n\n"
  );

  // Fix punctuation spacing
  text = text.replace(
    /\s+([,.;:!?])/g,
    "$1"
  );

  // Remove empty parentheses
  text = text.replace(
    /\(\s*\)/g,
    ""
  );

  // Remove obvious orphaned fragments
  text = text.replace(
    /\n\s*(?:See also|References|External links)\s*$/i,
    ""
  );

  return cleanBasicText(text);
}

/*
 * ============================================================
 * WIKIPEDIA SEARCH
 * ============================================================
 */

async function searchWikipedia(
  entityName: string
): Promise<WikipediaSearchPage[]> {
  const response =
    await axios.get<WikipediaSearchResponse>(
      `${WIKIPEDIA_API}/search/page`,
      {
        params: {
          q: entityName,
          limit: 8,
        },

        headers: {
          "User-Agent": USER_AGENT,
          Accept: "application/json",
        },

        timeout: 15000,
      }
    );

  return response.data.pages ?? [];
}

/*
 * ============================================================
 * WIKIPEDIA PAGE
 * ============================================================
 */

async function getWikipediaPage(
  key: string
): Promise<WikipediaPageResponse> {
  const response =
    await axios.get<WikipediaPageResponse>(
      `${WIKIPEDIA_API}/page/${encodeURIComponent(
        key
      )}`,
      {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "application/json",
        },

        timeout: 15000,
      }
    );

  return response.data;
}

/*
 * ============================================================
 * WIKIDATA SEARCH
 * ============================================================
 */

async function searchWikidata(
  entityName: string
): Promise<string | null> {
  const response =
    await axios.get<WikidataSearchResponse>(
      WIKIDATA_API,
      {
        params: {
          action: "wbsearchentities",
          search: entityName,
          language: "en",
          format: "json",
          limit: 5,
        },

        headers: {
          "User-Agent": USER_AGENT,
        },

        timeout: 15000,
      }
    );

  return (
    response.data.search?.[0]?.id ??
    null
  );
}

/*
 * ============================================================
 * WIKIDATA ENTITY
 * ============================================================
 */

async function getWikidataEntity(
  qid: string
): Promise<
  {
    claims?: Record<
      string,
      Array<{
        mainsnak?: {
          datavalue?: {
            value?: unknown;
          };
        };
      }>
    >;
  } | null
> {
  const response =
    await axios.get<WikidataEntityResponse>(
      WIKIDATA_API,
      {
        params: {
          action: "wbgetentities",
          ids: qid,
          props: "claims",
          format: "json",
        },

        headers: {
          "User-Agent": USER_AGENT,
        },

        timeout: 15000,
      }
    );

  return (
    response.data.entities?.[qid] ??
    null
  );
}

/*
 * ============================================================
 * WIKIDATA DATE
 * ============================================================
 */

function extractWikidataDate(
  entity: {
    claims?: Record<
      string,
      Array<{
        mainsnak?: {
          datavalue?: {
            value?: unknown;
          };
        };
      }>
    >;
  } | null,
  property: string
): string | null {
  const claim =
    entity?.claims?.[property]?.[0];

  const value =
    claim?.mainsnak?.datavalue?.value;

  if (
    !value ||
    typeof value !== "object"
  ) {
    return null;
  }

  const time =
    (value as { time?: unknown }).time;

  if (
    typeof time !== "string"
  ) {
    return null;
  }

  // Wikidata normally returns: +1870-10-19T00:00:00Z
  const match =
    time.match(
      /^[+-](\d{4})-(\d{2})-(\d{2})/
    );

  if (!match) {
    return null;
  }

  return `${match[1]}-${match[2]}-${match[3]}`;
}

/*
 * ============================================================
 * TEXT DATE EXTRACTION
 * ============================================================
 */

function extractDate(
  text: string,
  patterns: RegExp[]
): string | null {
  for (const pattern of patterns) {
    const match =
      text.match(pattern);

    if (!match) {
      continue;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    if (
      !year ||
      !month ||
      !day
    ) {
      continue;
    }

    const date =
      new Date(
        Date.UTC(
          year,
          month - 1,
          day
        )
      );

    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      continue;
    }

    return [
      year.toString().padStart(4, "0"),
      month.toString().padStart(2, "0"),
      day.toString().padStart(2, "0"),
    ].join("-");
  }

  return null;
}

/*
 * ============================================================
 * PLACE EXTRACTION
 * ============================================================
 * 
 * Conservative on purpose to avoid garbage fragments.
 * Only extracts well-formed location names from clear contexts.
 * ============================================================
 */

function findPlaces(
  text: string
): string[] {
  const results: string[] = [];

  const patterns = [
    // Places after location-related verbs and prepositions
    /\b(?:born|died|killed|arrested|imprisoned|lived|worked|educated|served|fought|married)\s+(?:at|in|near|from)\s+([A-Z][A-Za-z.'-]*(?:\s+[A-Z][A-Za-z.'-]*){0,4})/g,
    
    // Places after location prepositions
    /\b(?:at|near|from|in)\s+([A-Z][A-Za-z.'-]*(?:\s+[A-Z][A-Za-z.'-]*){0,3})(?=[,.;])/g,
    
    // Places with explicit location indicators
    /\b(?:city|town|village|region|district|province|state|country)\s+(?:of\s+)?([A-Z][A-Za-z.'-]*(?:\s+[A-Z][A-Za-z.'-]*){0,4})/g,
    
    // Capitalized place names with known location prepositions
    /\b(?:in|at|near|from)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})(?=\s*[,;.]\s*(?:where|which|and|but|or|for|on|with|without|by|during|after|before|through|across|around|between|among|throughout))/gi,
  ];

  for (
    const pattern of patterns
  ) {
    for (
      const match of text.matchAll(pattern)
    ) {
      let value =
        match[1]?.trim();

      if (!value) {
        continue;
      }

      value =
        value.replace(
          /[.,;:]+$/,
          ""
        );

      // Reject sentence fragments and invalid patterns
      if (
        value.length < 2 ||
        value.length > 60
      ) {
        continue;
      }

      if (
        /[.!?]/.test(value)
      ) {
        continue;
      }

      // Reject common non-place words
      if (
        /\b(?:was|were|the|and|with|request|movement|martyr|participation|government|called|named|after|became|when|where|which|that|this|these|those|there|their|them|they|what|who|whom|whose|why|how)\b/i.test(
          value
        )
      ) {
        continue;
      }

      // Reject dates and numbers
      if (
        /\d/.test(value)
      ) {
        continue;
      }

      // Reject single words that are likely common nouns
      if (
        !/\s/.test(value) &&
        /^(?:time|place|area|region|district|province|state|country|city|town|village|location|site|spot|point|position)$/i.test(
          value
        )
      ) {
        continue;
      }

      results.push(value);
    }
  }

  return unique(results).slice(
    0,
    20
  );
}

/*
 * ============================================================
 * HISTORICAL EVENTS / MOVEMENTS
 * ============================================================
 */

function findHistoricalEvents(
  text: string
): string[] {
  const knownEvents = [
    "Indian independence movement",
    "Quit India Movement",
    "Quit India movement",
    "Civil Disobedience Movement",
    "Civil Disobedience movement",
    "Salt March",
    "Non-Cooperation Movement",
    "Non-Cooperation movement",
    "Revolutionary movement",
    "Tamralipta Jatiya Sarkar",
    "Chowkidari Tax Bandha",
    "Swadeshi movement",
  ];

  const results: string[] = [];

  for (
    const event of knownEvents
  ) {
    if (
      text.toLowerCase().includes(
        event.toLowerCase()
      )
    ) {
      results.push(event);
    }
  }

  return unique(results);
}

/*
 * ============================================================
 * BATTLE EXTRACTION
 * ============================================================
 */

function findBattles(
  text: string
): string[] {
  const results: string[] = [];

  const pattern =
    /\b([A-Z][A-Za-z'-]*(?:\s+[A-Z][A-Za-z'-]*){0,5}\s+(?:Battle|War|Uprising|Rebellion|Campaign))\b/g;

  for (
    const match of text.matchAll(pattern)
  ) {
    if (match[1]) {
      results.push(
        match[1].trim()
      );
    }
  }

  return unique(results);
}

/*
 * ============================================================
 * KINGDOM / POLITY EXTRACTION
 * ============================================================
 */

function findKingdoms(
  text: string
): string[] {
  const results: string[] = [];

  const pattern =
    /\b([A-Z][A-Za-z'-]*(?:\s+[A-Z][A-Za-z'-]*){0,5}\s+(?:Kingdom|Empire|Sultanate|Dynasty|State|Polity))\b/g;

  for (
    const match of text.matchAll(pattern)
  ) {
    if (match[1]) {
      results.push(
        match[1].trim()
      );
    }
  }

  return unique(results);
}

/*
 * ============================================================
 * UNIQUE VALUES
 * ============================================================
 */

function unique(
  values: string[]
): string[] {
  const seen =
    new Set<string>();

  const result: string[] = [];

  for (const value of values) {
    const cleaned =
      value.trim();

    if (!cleaned) {
      continue;
    }

    const normalized =
      cleaned.toLowerCase();

    if (
      seen.has(normalized)
    ) {
      continue;
    }

    seen.add(normalized);
    result.push(cleaned);
  }

  return result;
}

/*
 * ============================================================
 * MAIN AUTOMATIC RESEARCH
 * ============================================================
 */

export async function researchWeb(
  entityType: EntityType,
  entityName: string
): Promise<WebResearchResult> {
  console.log("");

  console.log(
    "========================================"
  );

  console.log(
    "AUTOMATIC WEB RESEARCH"
  );

  console.log(
    "========================================"
  );

  console.log(
    `ENTITY TYPE : ${entityType}`
  );

  console.log(
    `ENTITY NAME : ${entityName}`
  );

  console.log("");

  console.log(
    "Searching Wikipedia..."
  );

  const pages =
    await searchWikipedia(
      entityName
    );

  if (
    pages.length === 0
  ) {
    return {
      entityType,
      entityName,

      summary: null,

      eventDate: null,

      birthDate: null,
      deathDate: null,

      kingdoms: [],
      places: [],
      battles: [],
      historicalEvents: [],

      sources: [],

      researchCompleted: true,

      researchNote:
        "No Wikipedia result was found.",
    };
  }

  const best =
    pages[0];

  const pageKey =
    best.key ??
    best.title ??
    entityName;

  console.log(
    `Wikipedia result : ${
      best.title ?? pageKey
    }`
  );

  let page:
    WikipediaPageResponse = {};

  try {
    page =
      await getWikipediaPage(
        pageKey
      );

    console.log(
      "Wikipedia article loaded."
    );
  } catch {
    console.log(
      "Wikipedia article could not be loaded."
    );
  }

  // Prefer full article source
  const rawWikipediaText =
    page.source ??
    best.excerpt ??
    best.description ??
    "";

  const wikipediaText =
    cleanWikipediaText(
      rawWikipediaText
    );

  const wikipediaUrl =
    `https://en.wikipedia.org/wiki/${encodeURIComponent(
      pageKey.replace(/ /g, "_")
    )}`;

  const wikipediaSource =
    source(
      best.title ??
        entityName,
      wikipediaUrl,
      "Wikimedia Wikipedia"
    );

  /*
   * ==========================================================
   * WIKIDATA
   * ==========================================================
   */

  console.log(
    "Searching Wikidata..."
  );

  let birthDate:
    string | null = null;

  let deathDate:
    string | null = null;

  let wikidataSource:
    ResearchSource | null = null;

  try {
    const qid =
      await searchWikidata(
        entityName
      );

    if (qid) {
      console.log(
        `Wikidata entity : ${qid}`
      );

      const entity =
        await getWikidataEntity(
          qid
        );

      birthDate =
        extractWikidataDate(
          entity,
          "P569"
        );

      deathDate =
        extractWikidataDate(
          entity,
          "P570"
        );

      wikidataSource =
        source(
          `Wikidata ${qid}`,
          `https://www.wikidata.org/wiki/${qid}`,
          "Wikimedia Wikidata"
        );
    }
  } catch {
    console.log(
      "Wikidata lookup failed; continuing with Wikipedia."
    );
  }

  /*
   * ==========================================================
   * FALLBACK DATE EXTRACTION
   * ==========================================================
   */

  if (!birthDate) {
    birthDate =
      extractDate(
        wikipediaText,
        [
          /born[^0-9]{0,40}(\d{4})[-./](\d{1,2})[-./](\d{1,2})/i,
        ]
      );
  }

  if (!deathDate) {
    deathDate =
      extractDate(
        wikipediaText,
        [
          /died[^0-9]{0,40}(\d{4})[-./](\d{1,2})[-./](\d{1,2})/i,
        ]
      );
  }

  /*
   * ==========================================================
   * DESCRIPTION
   * ==========================================================
   * 
   * Keep the broad article description without truncation.
   * Preserves paragraph separation for clean prose.
   */

  const description =
    wikipediaText
      .replace(
        /\n{3,}/g,
        "\n\n"
      )
      .trim();

  /*
   * ==========================================================
   * STRUCTURED EXTRACTION
   * ==========================================================
   */

  const places =
    findPlaces(
      wikipediaText
    );

  const kingdoms =
    findKingdoms(
      wikipediaText
    );

  const battles =
    findBattles(
      wikipediaText
    );

  const historicalEvents =
    findHistoricalEvents(
      wikipediaText
    );

  /*
   * ==========================================================
   * EVENT DATE
   * ==========================================================
   */

  let eventDate:
    string | null = null;

  if (
    entityType === "event"
  ) {
    eventDate =
      extractDate(
        wikipediaText,
        [
          /(?:on|dated|occurred|began|started|took place)[^0-9]{0,40}(\d{4})[-./](\d{1,2})[-./](\d{1,2})/i,
        ]
      );
  }

  /*
   * ==========================================================
   * SOURCES
   * ==========================================================
   */

  const sources: ResearchSource[] = [
    wikipediaSource,
  ];

  if (
    wikidataSource
  ) {
    sources.push(
      wikidataSource
    );
  }

  /*
   * ==========================================================
   * RESULT
   * ==========================================================
   */

  const result: WebResearchResult = {
    entityType,
    entityName,

    summary:
      description || null,

    eventDate,

    birthDate,
    deathDate,

    kingdoms,
    places,
    battles,

    historicalEvents,

    sources,

    researchCompleted:
      true,

    researchNote:
      "Automatic research completed using public Wikimedia Wikipedia and Wikidata APIs. The description contains broad cleaned article prose; structured dates are supplemented by Wikidata. Results remain research proposals and must be manually verified before MongoDB insertion.",
  };

  /*
   * ==========================================================
   * DISPLAY
   * ==========================================================
   */

  console.log("");

  console.log(
    "========================================"
  );

  console.log(
    "AUTOMATIC RESEARCH RESULT"
  );

  console.log(
    "========================================"
  );

  console.log("");

  console.log(
    "DESCRIPTION"
  );

  console.log(
    "----------------------------------------"
  );

  console.log(
    description || "NOT FOUND"
  );

  console.log("");

  console.log(
    "DATES"
  );

  console.log(
    "----------------------------------------"
  );

  if (
    entityType === "event"
  ) {
    console.log(
      `EVENT DATE : ${
        eventDate ??
        "NOT FOUND"
      }`
    );
  } else {
    console.log(
      `BIRTH DATE : ${
        birthDate ??
        "NOT FOUND"
      }`
    );

    console.log(
      `DEATH DATE : ${
        deathDate ??
        "NOT FOUND"
      }`
    );
  }

  console.log("");

  console.log(
    "PLACES"
  );

  console.log(
    "----------------------------------------"
  );

  console.log(
    places.length
      ? places.join(", ")
      : "NONE"
  );

  console.log("");

  console.log(
    "KINGDOMS / POLITIES"
  );

  console.log(
    "----------------------------------------"
  );

  console.log(
    kingdoms.length
      ? kingdoms.join(", ")
      : "NONE"
  );

  console.log("");

  console.log(
    "HISTORICAL EVENTS / MOVEMENTS"
  );

  console.log(
    "----------------------------------------"
  );

  console.log(
    historicalEvents.length
      ? historicalEvents.join(", ")
      : "NONE"
  );

  console.log("");

  console.log(
    "BATTLES"
  );

  console.log(
    "----------------------------------------"
  );

  console.log(
    battles.length
      ? battles.join(", ")
      : "NONE"
  );

  console.log("");

  console.log(
    "SOURCES"
  );

  console.log(
    "----------------------------------------"
  );

  sources.forEach(
    (item, index) => {
      console.log(
        `${index + 1}. ${item.title}`
      );

      console.log(
        `   ${item.url}`
      );
    }
  );

  console.log("");

  console.log(
    "RESEARCH STATUS : COMPLETED"
  );

  return result;
}

/*
 * ============================================================
 * COMPATIBILITY HELPERS
 * ============================================================
 */

export function createResearchSource(
  title: string,
  url: string,
  publisher?: string | null
): ResearchSource {
  return {
    title: title.trim(),
    url: url.trim(),
    publisher:
      publisher?.trim() ?? null,
    accessedAt:
      new Date().toISOString(),
  };
}

export function createFinding(
  field: WebResearchFinding["field"],
  value: string,
  source: ResearchSource
): WebResearchFinding {
  return {
    field,
    value: value.trim(),
    source,
  };
}

export function buildResearchFindings(
  entityType: EntityType,
  entityName: string,
  findings: WebResearchFinding[]
): WebResearchFindings {
  return {
    entityType,
    entityName: entityName.trim(),
    findings: [...findings],
    completed: true,
  };
}

export function getFindingsForField(
  findings: WebResearchFindings,
  field: WebResearchFinding["field"]
): WebResearchFinding[] {
  return findings.findings.filter(
    (finding) =>
      finding.field === field
  );
}

export function getUniqueFindingValues(
  findings: WebResearchFindings,
  field: WebResearchFinding["field"]
): string[] {
  return unique(
    getFindingsForField(
      findings,
      field
    ).map(
      (finding) =>
        finding.value
    )
  );
}

export function getDateFinding(
  findings: WebResearchFindings,
  field:
    | "eventDate"
    | "birthDate"
    | "deathDate"
): string | null {
  return (
    getUniqueFindingValues(
      findings,
      field
    )[0] ?? null
  );
}

export type ResearchConflict = {
  field: WebResearchFinding["field"];

  values: string[];

  sources: ResearchSource[];
};

export function findResearchConflicts(
  findings: WebResearchFindings
): ResearchConflict[] {
  const conflicts:
    ResearchConflict[] = [];

  for (
    const field of [
      "eventDate",
      "birthDate",
      "deathDate",
      "kingdom",
      "place",
      "battle",
    ] as WebResearchFinding["field"][]
  ) {
    const values =
      getUniqueFindingValues(
        findings,
        field
      );

    if (
      values.length > 1
    ) {
      conflicts.push({
        field,
        values,
        sources:
          getFindingsForField(
            findings,
            field
          ).map(
            (finding) =>
              finding.source
          ),
      });
    }
  }

  return conflicts;
}

export function buildResearchResult(
  findings: WebResearchFindings
): WebResearchResult {
  const get =
    (
      field: WebResearchFinding["field"]
    ) =>
      getUniqueFindingValues(
        findings,
        field
      );

  const conflicts =
    findResearchConflicts(
      findings
    );

  const sourceMap =
    new Map<
      string,
      ResearchSource
    >();

  for (
    const finding of findings.findings
  ) {
    sourceMap.set(
      finding.source.url
        .trim()
        .toLowerCase(),
      finding.source
    );
  }

  return {
    entityType:
      findings.entityType,

    entityName:
      findings.entityName,

    summary:
      get("summary")[0] ?? null,

    eventDate:
      get("eventDate")[0] ?? null,

    birthDate:
      get("birthDate")[0] ?? null,

    deathDate:
      get("deathDate")[0] ?? null,

    kingdoms:
      get("kingdom"),

    places:
      get("place"),

    battles:
      get("battle"),

    historicalEvents: [],

    sources:
      Array.from(
        sourceMap.values()
      ),

    researchCompleted:
      findings.completed,

    researchNote:
      conflicts.length
        ? `${conflicts.length} conflicting field(s) require manual verification.`
        : "Research completed.",
  };
}

export function printResearchResult(
  result: WebResearchResult
): void {
  console.log("");

  console.log(
    "========================================"
  );

  console.log(
    "WEB RESEARCH RESULT"
  );

  console.log(
    "========================================"
  );

  console.log(
    `ENTITY TYPE : ${result.entityType}`
  );

  console.log(
    `ENTITY NAME : ${result.entityName}`
  );

  console.log(
    `EVENT DATE  : ${
      result.eventDate ??
      "NONE"
    }`
  );

  console.log(
    `BIRTH DATE  : ${
      result.birthDate ??
      "NONE"
    }`
  );

  console.log(
    `DEATH DATE  : ${
      result.deathDate ??
      "NONE"
    }`
  );

  console.log(
    `KINGDOMS    : ${
      result.kingdoms.length
        ? result.kingdoms.join(", ")
        : "NONE"
    }`
  );

  console.log(
    `PLACES      : ${
      result.places.length
        ? result.places.join(", ")
        : "NONE"
    }`
  );

  console.log(
    `BATTLES     : ${
      result.battles.length
        ? result.battles.join(", ")
        : "NONE"
    }`
  );

  console.log(
    `HISTORICAL EVENTS : ${
      result.historicalEvents.length
        ? result.historicalEvents.join(", ")
        : "NONE"
    }`
  );

  console.log(
    `SOURCES     : ${result.sources.length}`
  );

  result.sources.forEach(
    (item, index) => {
      console.log(
        `SOURCE ${index + 1}: ${item.title}`
      );

      console.log(
        `  ${item.url}`
      );
    }
  );

  console.log(
    `RESEARCH COMPLETED : ${
      result.researchCompleted
        ? "YES"
        : "NO"
    }`
  );

  console.log(
    `NOTE : ${result.researchNote}`
  );
}