/*
 * scripts/data-entry/research/sourceDiscovery.ts
 *
 * Selects relevant public research sources for an entity.
 *
 * IMPORTANT:
 * - This file does NOT fetch web pages.
 * - This file does NOT decide whether a historical claim is true.
 * - It only determines which registered sources should be searched.
 * - Regional sources are selected only when relevant.
 * - Uses Wikipedia/Wikidata identity lookup for dynamic region detection.
 */

import type {
  EntityType,
} from "../db/entityInput";

import {
  getEnabledResearchSources,
} from "./sourceRegistry";

import type {
  ResearchSourceDefinition,
} from "./sourceRegistry";

import axios from "axios";

export type IdentityContext = {
  entityName: string;
  description: string;
  wikipediaUrl: string | null;
  wikidataId: string | null;
  birthPlace: string | null;
  deathPlace: string | null;
  citizenship: string[];
  occupations: string[];
  knownFor: string[];
};

export type SourceDiscoveryResult = {
  entityType: EntityType;

  entityName: string;

  regionHints: string[];

  subjectHints: string[];

  sources: ResearchSourceDefinition[];

  identityContext?: IdentityContext;
};

/*
 * ============================================================
 * WIKIPEDIA/WIKIDATA API HELPERS
 * ============================================================
 */

const WIKIPEDIA_API = "https://en.wikipedia.org/w/rest.php/v1";
const WIKIDATA_API = "https://www.wikidata.org/w/api.php";
const USER_AGENT = "VeerBharat/1.0 historical-research-tool";

type WikipediaPageResponse = {
  title?: string;
  source?: string;
  html?: string;
};

type WikipediaSearchResponse = {
  pages?: Array<{
    id?: number;
    key?: string;
    title?: string;
    excerpt?: string;
    description?: string | null;
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
      labels?: Record<
        string,
        {
          value: string;
        }
      >;
    }
  >;
};

type WikidataSearchResponse = {
  search?: Array<{
    id: string;
    label?: string;
    description?: string;
  }>;
};

type WikidataLabelResponse = {
  entities?: Record<
    string,
    {
      labels?: Record<
        string,
        {
          value: string;
        }
      >;
      descriptions?: Record<
        string,
        {
          value: string;
        }
      >;
    }
  >;
};

/*
 * ============================================================
 * UTILITY FUNCTIONS
 * ============================================================
 */

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown error occurred';
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Check if it's a rate limit error (429)
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        const waitTime = baseDelay * Math.pow(2, attempt - 1);
        console.log(`  Rate limited (429). Waiting ${waitTime}ms before retry ${attempt}/${maxRetries}...`);
        await delay(waitTime);
        continue;
      }
      
      // For other errors, retry with shorter delay
      if (attempt < maxRetries) {
        const waitTime = baseDelay * 0.5;
        console.log(`  Request failed. Waiting ${waitTime}ms before retry ${attempt}/${maxRetries}...`);
        await delay(waitTime);
        continue;
      }
    }
  }
  
  throw lastError;
}

/*
 * ============================================================
 * WIKIPEDIA IDENTITY LOOKUP
 * ============================================================
 */

async function searchWikipedia(
  entityName: string
): Promise<{
  key: string | null;
  title: string | null;
  excerpt: string | null;
  description: string | null;
}> {
  try {
    return await retryWithBackoff(async () => {
      console.log(`  Searching Wikipedia for: "${entityName}"`);
      const response = await axios.get<WikipediaSearchResponse>(
        `${WIKIPEDIA_API}/search/page`,
        {
          params: {
            q: entityName,
            limit: 3,
          },
          headers: {
            "User-Agent": USER_AGENT,
            Accept: "application/json",
          },
          timeout: 15000,
        }
      );

      const pages = response.data.pages ?? [];
      if (pages.length === 0) {
        console.log(`  No Wikipedia results found`);
        return { key: null, title: null, excerpt: null, description: null };
      }

      const best = pages[0];
      console.log(`  Found Wikipedia result: ${best.title}`);
      return {
        key: best.key ?? best.title ?? null,
        title: best.title ?? null,
        excerpt: best.excerpt ?? null,
        description: best.description ?? null,
      };
    }, 3, 1000);
  } catch (error) {
    console.log(`  Wikipedia search error:`, getErrorMessage(error));
    return { key: null, title: null, excerpt: null, description: null };
  }
}

async function getWikipediaPage(
  key: string
): Promise<{ source: string | null; title: string | null }> {
  try {
    return await retryWithBackoff(async () => {
      console.log(`  Fetching Wikipedia page: ${key}`);
      const response = await axios.get<WikipediaPageResponse>(
        `${WIKIPEDIA_API}/page/${encodeURIComponent(key)}`,
        {
          headers: {
            "User-Agent": USER_AGENT,
            Accept: "application/json",
          },
          timeout: 15000,
        }
      );

      return {
        source: response.data.source ?? null,
        title: response.data.title ?? null,
      };
    }, 3, 1000);
  } catch (error) {
    console.log(`  Wikipedia page fetch error:`, getErrorMessage(error));
    return { source: null, title: null };
  }
}

/*
 * ============================================================
 * WIKIDATA IDENTITY LOOKUP
 * ============================================================
 */

async function searchWikidata(
  entityName: string,
  context?: IdentityContext
): Promise<string | null> {
  try {
    return await retryWithBackoff(async () => {
      console.log(`  Searching Wikidata for: "${entityName}"`);

      const response = await axios.get<WikidataSearchResponse>(
        WIKIDATA_API,
        {
          params: {
            action: "wbsearchentities",
            search: entityName,
            language: "en",
            format: "json",
            limit: 10,
          },
          headers: {
            "User-Agent": USER_AGENT,
          },
          timeout: 15000,
        }
      );

      const results = response.data.search || [];

      console.log(
        `  Found ${results.length} Wikidata candidates`
      );

      if (results.length === 0) {
        console.log(`  No Wikidata results found`);
        return null;
      }

      const normalizedName = normalize(entityName);

      /*
       * Score every candidate instead of immediately accepting
       * the first exact label match.
       */
      const scored = results.map((result) => {
        let score = 0;

        const label = normalize(result.label || "");
        const description = normalize(result.description || "");

        // Exact label = useful, but NOT sufficient by itself.
        if (label === normalizedName) {
          score += 50;
        } else if (
          label.includes(normalizedName) ||
          normalizedName.includes(label)
        ) {
          score += 20;
        }

        /*
         * Historical/person-related descriptions.
         */
        const historicalKeywords = [
          "freedom fighter",
          "revolutionary",
          "revolution",
          "independence activist",
          "independence",
          "military leader",
          "military commander",
          "soldier",
          "warrior",
          "king",
          "emperor",
          "ruler",
          "queen",
          "politician",
          "activist",
          "historian",
          "martyr",
        ];

        for (const keyword of historicalKeywords) {
          if (description.includes(keyword)) {
            score += 10;
          }
        }

        /*
         * If Wikipedia already identified the person, prefer
         * candidates whose description looks like a person.
         */
        if (context?.description) {
          const contextText = normalize(context.description);

          if (
            contextText.includes("freedom") &&
            description.includes("freedom")
          ) {
            score += 20;
          }

          if (
            contextText.includes("revolution") &&
            description.includes("revolution")
          ) {
            score += 15;
          }

          if (
            contextText.includes("military") &&
            description.includes("military")
          ) {
            score += 15;
          }
        }

        /*
         * Penalize obviously unrelated modern/technical entities.
         */
        const unrelatedKeywords = [
          "researcher",
          "scientist",
          "software",
          "company",
          "organization",
          "journal",
          "species",
          "chemical compound",
          "asteroid",
          "film",
          "album",
          "song",
          "fictional character",
        ];

        for (const keyword of unrelatedKeywords) {
          if (description.includes(keyword)) {
            score -= 30;
          }
        }

        return {
          result,
          score,
        };
      });

      scored.sort((a, b) => b.score - a.score);

      console.log(`  Wikidata candidate ranking:`);

      for (const candidate of scored.slice(0, 5)) {
        console.log(
          `    ${candidate.score} | ${candidate.result.label || "Unknown"} (${candidate.result.id}) | ${candidate.result.description || "No description"}`
        );
      }

      const best = scored[0];

      if (!best) {
        return null;
      }

      console.log(
        `  Selected: ${best.result.label || "Unknown"} (${best.result.id})`
      );

      return best.result.id;
    }, 3, 1000);
  } catch (error) {
    console.log(
      `  Wikidata search error:`,
      getErrorMessage(error)
    );

    return null;
  }
}

async function getWikidataEntity(
  qid: string
): Promise<{
  claims: Record<string, Array<{ mainsnak?: { datavalue?: { value?: unknown } } }>> | null;
}> {
  try {
    return await retryWithBackoff(async () => {
      console.log(`  Fetching Wikidata entity: ${qid}`);
      const response = await axios.get<WikidataEntityResponse>(
        WIKIDATA_API,
        {
          params: {
            action: "wbgetentities",
            ids: qid,
            props: "claims|labels",
            languages: "en",
            format: "json",
          },
          headers: {
            "User-Agent": USER_AGENT,
          },
          timeout: 15000,
        }
      );

      const entity = response.data.entities?.[qid];
      if (!entity) {
        console.log(`  No entity found for QID: ${qid}`);
        return { claims: null };
      }
      
      console.log(`  Successfully fetched entity: ${qid}`);
      return {
        claims: entity.claims ?? null,
      };
    }, 3, 1000);
  } catch (error) {
    console.log(`  Wikidata entity fetch error:`, getErrorMessage(error));
    return { claims: null };
  }
}

async function getWikidataLabels(
  qids: string[]
): Promise<Record<string, string>> {
  if (qids.length === 0) return {};

  try {
    return await retryWithBackoff(async () => {
      console.log(`  Resolving ${qids.length} Wikidata labels...`);
      const response = await axios.get<WikidataLabelResponse>(
        WIKIDATA_API,
        {
          params: {
            action: "wbgetentities",
            ids: qids.join("|"),
            props: "labels|descriptions",
            languages: "en",
            format: "json",
          },
          headers: {
            "User-Agent": USER_AGENT,
          },
          timeout: 15000,
        }
      );

      const labels: Record<string, string> = {};
      const entities = response.data.entities ?? {};
      
      for (const [qid, entity] of Object.entries(entities)) {
        if (entity.labels?.en?.value) {
          labels[qid] = entity.labels.en.value;
        }
      }
      
      console.log(`  Resolved ${Object.keys(labels).length} labels`);
      return labels;
    }, 3, 1000);
  } catch (error) {
    console.log(`  Wikidata label fetch error:`, getErrorMessage(error));
    return {};
  }
}

function extractWikidataString(
  entity: { claims: Record<string, any> | null },
  property: string
): string | null {
  const claim = entity.claims?.[property]?.[0];
  const value = claim?.mainsnak?.datavalue?.value;
  if (!value) return null;
  
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null) {
    return (value as any).id || (value as any).value || null;
  }
  return null;
}

function extractWikidataStringList(
  entity: { claims: Record<string, any> | null },
  property: string
): string[] {
  const claims = entity.claims?.[property] ?? [];
  const values: string[] = [];
  
  for (const claim of claims) {
    const value = claim?.mainsnak?.datavalue?.value;
    if (!value) continue;
    
    if (typeof value === "string") {
      values.push(value);
    } else if (typeof value === "object" && value !== null) {
      const str = (value as any).id || (value as any).value || null;
      if (str) values.push(str);
    }
  }
  
  return values;
}

function extractWikidataPlaceQids(
  entity: { claims: Record<string, any> | null },
  property: string
): string[] {
  const claims = entity.claims?.[property] ?? [];
  const qids: string[] = [];
  
  for (const claim of claims) {
    const value = claim?.mainsnak?.datavalue?.value;
    if (!value || typeof value !== "object") continue;
    
    const id = (value as any).id;
    if (id && typeof id === "string" && id.startsWith("Q")) {
      qids.push(id);
    }
  }
  
  return qids;
}

/*
 * ============================================================
 * IDENTITY CONTEXT RESOLUTION
 * ============================================================
 */

async function resolveIdentityContext(
  entityName: string
): Promise<IdentityContext> {
  const context: IdentityContext = {
    entityName,
    description: "",
    wikipediaUrl: null,
    wikidataId: null,
    birthPlace: null,
    deathPlace: null,
    citizenship: [],
    occupations: [],
    knownFor: [],
  };

  // Step 1: Search Wikipedia
  const wikiSearch = await searchWikipedia(entityName);
  if (wikiSearch.key) {
    context.wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(
      wikiSearch.key.replace(/ /g, "_")
    )}`;
    
    // Get full page for more context
    const wikiPage = await getWikipediaPage(wikiSearch.key);
    if (wikiPage.source) {
      // Extract first paragraph as description
      const firstParagraph = wikiPage.source
        .split(/\n\n+/)[0]
        .replace(/<[^>]*>/g, "")
        .trim();
      context.description = firstParagraph || wikiSearch.excerpt || "";
    } else {
      context.description = wikiSearch.excerpt || wikiSearch.description || "";
    }
  }

  // Delay between Wikipedia and Wikidata calls
  await delay(1000);

  // Step 2: Search Wikidata
  const qid = await searchWikidata(
    entityName,
    context
    );
  if (qid) {
    context.wikidataId = qid;
    
    // Delay before fetching entity
    await delay(500);
    
    const entity = await getWikidataEntity(qid);
    
    if (entity.claims) {
      // Collect all QIDs that need labels
      const qidsToResolve: string[] = [];
      
      // Birth place (P19)
      const birthQids = extractWikidataPlaceQids(entity, "P19");
      if (birthQids.length > 0) {
        qidsToResolve.push(...birthQids);
      }
      
      // Death place (P20)
      const deathQids = extractWikidataPlaceQids(entity, "P20");
      if (deathQids.length > 0) {
        qidsToResolve.push(...deathQids);
      }
      
      // Citizenship (P27)
      const citizenshipQids = extractWikidataPlaceQids(entity, "P27");
      if (citizenshipQids.length > 0) {
        qidsToResolve.push(...citizenshipQids);
      }
      
      // Occupation (P106)
      const occupationQids = extractWikidataPlaceQids(entity, "P106");
      if (occupationQids.length > 0) {
        qidsToResolve.push(...occupationQids);
      }
      
      // Known for (P1424)
      const knownForQids = extractWikidataPlaceQids(entity, "P1424");
      if (knownForQids.length > 0) {
        qidsToResolve.push(...knownForQids);
      }
      
      // Resolve labels if we have QIDs
      let labels: Record<string, string> = {};
      if (qidsToResolve.length > 0) {
        await delay(500);
        labels = await getWikidataLabels(qidsToResolve);
      }
      
      // Set birth place
      if (birthQids.length > 0) {
        context.birthPlace = birthQids.map(q => labels[q] || q).join(", ");
      }
      
      // Set death place
      if (deathQids.length > 0) {
        context.deathPlace = deathQids.map(q => labels[q] || q).join(", ");
      }
      
      // Set citizenship
      if (citizenshipQids.length > 0) {
        context.citizenship = citizenshipQids.map(q => labels[q] || q);
      }
      
      // Set occupations
      if (occupationQids.length > 0) {
        context.occupations = occupationQids.map(q => labels[q] || q);
      }
      
      // Set known for
      if (knownForQids.length > 0) {
        context.knownFor = knownForQids.map(q => labels[q] || q);
      }
    }
  }

  // Log what we found
  console.log(`  Identity context resolved:`);
  console.log(`    - Birth Place: ${context.birthPlace || 'Unknown'}`);
  console.log(`    - Death Place: ${context.deathPlace || 'Unknown'}`);
  console.log(`    - Occupations: ${context.occupations.join(', ') || 'Unknown'}`);
  console.log(`    - Citizenship: ${context.citizenship.join(', ') || 'Unknown'}`);

  return context;
}

/*
 * ============================================================
 * REGION KEYWORDS
 * ============================================================
 */

const REGION_KEYWORDS: Record<
  string,
  string[]
> = {
  bengal: [
    "bengal", "bengali", "west bengal", "east bengal", "kolkata", "calcutta",
    "medinipur", "midnapore", "tamluk", "hooghly", "howrah", "murshidabad",
    "nadia", "bardhaman", "burdwan", "bankura", "birbhum", "malda",
    "dinajpur", "chittagong", "dhaka", "bangladesh",
    "darjeeling", "cooch behar", "jalpaiguri", "siliguri", "purulia",
    "kharagpur", "durgapur", "asansol", "chandannagar", "serampore",
    "barrackpore", "bally", "rishra", "konnagar", "ugrasen", "chinsurah"
    ],

  maharashtra: [
    "maharashtra", "maratha", "maratha empire", "mumbai", "bombay",
    "pune", "poona", "satara", "kolhapur", "raigad", "pratapgad", "deccan",
    // ADD THESE:
    "nagpur", "thane", "nashik", "aurangabad", "solapur", "amravati",
    "akola", "ahmednagar", "jalgaon", "latur", "nanded", "sangli",
    "ratnagiri", "sindhudurg", "palghar", "ravet", "chinchwad", "pimpri",
    "kopargaon", "beed", "osmanabad", "buldhana", "yavatmal", "wardha",
    "chandrapur", "gadchiroli", "bhandara", "gondia"
    ],

  assam: [
    "assam",
    "assamese",
    "guwahati",
    "kamrup",
    "ahom",
    "brahmaputra",
    "charaideo",
    "jorhat",
    // ADD THESE:
    "dibrugarh", "silchar", "nagaon", "tezpur", "tinsukia",
    "bongaigaon", "dhubri", "barpeta", "sibsagar", "sivasagar",
    "golaghat", "lakhimpur", "dhemaji", "kokrajhar", "bonai",
    "baksa", "udalguri", "chirang", "goalpara", "morigaon",
    "sonitpur", "nalbari", "barpeta", "darrang", "marigaon",
    "karbi anglong", "dima hasao", "hailakandi", "karimganj",
    "cachar", "nowgong", "rangia", "mangaldoi", "jagiroad",
    "sualkuchi", "hajo", "sadiya", "digboi", "margherita",
    "namrup", "duliajan", "chabua", "gohpur", "biswanath",
    "majuli", "kaziranga", "sonitpur", "batadrava", "sualkuchi",
    "north lakhimpur", "silapathar", "dhemaji", "gerukamukh",
    "joypur", "khowang", "tikar", "simaluguri", "amguri"
    ],

  himachal_pradesh: [
    "himachal", "himachal pradesh", "shimla", "manali", "dharamshala",
    "kullu", "kangra", "mandi", "solan", "bilaspur", "chamba",
    "hamirpur", "una", "kinnaur", "lahaul", "spiti"
    ],

    uttarakhand: [
    "uttarakhand", "dehradun", "haridwar", "rishikesh", "nainital",
    "almora", "pithoragarh", "chamoli", "rudraprayag", "tehri",
    "pauri", "bageshwar", "champawat", "udham singh nagar", "roorkee",
    "mussorie", "kedarnath", "badrinath", "gangotri", "yamunotri"
    ],

    sikkim: [
    "sikkim", "gangtok", "pelling", "namchi", "gyalshing",
    "mangan", "lachen", "lachung", "yumthang", "nathu la"
    ],

    goa: [
    "goa", "panaji", "panjim", "margao", "vasco", "mapusa",
    "ponda", "bicholim", "sanguem", "canacona", "pernem",
    "queen's necklace", "candolim", "calangute", "anjuna", "baga"
    ],

  karnataka: [
    "karnataka", "kannada", "mysore", "mangalore", "bengaluru",
    "bangalore", "belgaum", "vijayanagara",
    // ADD THESE:
    "hubballi", "dharwad", "gulbarga", "bellary", "bijapur",
    "tumkur", "shimoga", "davanagere", "raichur", "bidar",
    "hospet", "chitradurga", "hassan", "udupi", "chikmagalur",
    "mandya", "kolar", "madikeri", "karwar", "chamarajanagar"
    ],

  tamil_nadu: [
    "tamil nadu", "tamil", "madras", "chennai", "tiruchirappalli",
    "trichy", "thanjavur", "tanjore", "madurai",
    // ADD THESE:
    "coimbatore", "salem", "tirunelveli", "vellore", "kanyakumari",
    "nagercoil", "kodaikanal", "ooty", "nilgiris", "ranipet",
    "dindigul", "karur", "erode", "namakkal", "tiruvannamalai",
    "cuddalore", "chidambaram", "nagapattinam", "ramanathapuram",
    "sivaganga", "pudukkottai", "thoothukudi", "kallakurichi"
    ],

  kerala: [
    "kerala", "malabar", "travancore", "cochin", "kochi",
    "thiruvananthapuram", "calicut", "kozhikode", "kannur",
    // ADD THESE:
    "ernakulam", "thrissur", "kollam", "alappuzha", "palakkad",
    "wayanad", "idukki", "kottayam", "pathanamthitta", "kasargod",
    "malappuram", "varkala", "kumarakom", "kovalam", "munnar",
    "periyar", "trivandrum"
    ],

  andhra_pradesh: [
    "andhra", "andhra pradesh", "telugu", "visakhapatnam",
    "vijayawada", "guntur", "alluri",
    // ADD THESE:
    "amaravati", "nellore", "kurnool", "rajahmundry", "tirupati",
    "kakinada", "anantapur", "chittoor", "kadapa", "ongole",
    "vizianagaram", "srikakulam", "eluru", "machilipatnam",
    "tenali", "narasaraopet", "hindupur", "proddatur"
    ],

  telangana: [
    "telangana",
    "hyderabad",
    "telugu",
    "warangal",
    "nizam",
    // ADD ALL THESE DISTRICTS & CITIES:
    "secunderabad", "karimnagar", "nizamabad", "ramagundam", "khammam",
    "mahabubnagar", "nalgonda", "adilabad", "siddipet", "medak",
    "sangareddy", "miryalaguda", "jagtial", "peddapalli", "mancherial",
    "kamareddy", "vikarabad", "rangareddy", "medchal", "shamshabad",
    "kothagudem", "palvancha", "bhadrachalam", "suryapet", "huzurnagar",
    "devarakonda", "nagarjuna sagar", "bhongir", "alwal", "malkajgiri",
    "kukatpally", "gachibowli", "hitec city", "charminar", "golconda",
    "qutb shahi", "osmania", "falaknuma", "tank bund", "necklace road",
    "bidar", "zaheerabad", "tandur", "kollapur", "gadwal", "wanaparthy",
    "nagarkurnool", "amangal", "shadnagar", "farooqnagar"
    ],

  odisha: [
    "odisha", "orissa", "odia", "kalinga", "bhubaneswar",
    "cuttack", "puri",
    // ADD THESE:
    "sambalpur", "rourkela", "berhampur", "balasore", "bhadrak",
    "jajpur", "kendrapara", "jagatsinghpur", "dhenkanal", "angul",
    "sundargarh", "keonjhar", "mayurbhanj", "kandhamal", "koraput",
    "malkangiri", "nabarangpur", "rayagada", "kalahandi"
    ],

  punjab: [
    "punjab", "punjabi", "amritsar", "lahore", "sikh", "sikhism",
    // ADD THESE:
    "ludhiana", "jalandhar", "patiala", "chandigarh", "mohali",
    "bathinda", "batala", "phagwara", "hoshiarpur", "moga",
    "fatehgarh sahib", "sangrur", "muktsar", "fazilka", "firozpur",
    "kapurthala", "nawanshahr", "ropar", "gurdaspur", "pathankot",
    "abohar", "kharar", "zirakpur"
    ],

  rajasthan: [
    "rajasthan", "rajput", "rajputana", "jaipur", "jodhpur", "udaipur",
    "mewar", "marwar", "chittorgarh",
    // ADD THESE:
    "bikaner", "ajmer", "kota", "jaisalmer", "bharatpur",
    "alwar", "sikar", "tonk", "bhilwara", "pali", "barmer",
    "nagaur", "hanumangarh", "ganganagar", "churu", "jhunjhunu",
    "dausa", "karauli", "sawai madhopur", "dholpur", "banswara",
    "pratapgarh", "sirohi", "jhalawar", "bundi"
    ],

  gujarat: [
    "gujarat", "gujarati", "ahmedabad", "surat", "vadodara", "baroda",
    "saurashtra",
    // ADD THESE:
    "rajkot", "bhavnagar", "jamnagar", "junagadh", "gandhinagar",
    "anand", "navsari", "bharuch", "vapi", "porbandar", "dwarka",
    "somnath", "palanpur", "mehsana", "nadiad", "morbi", "gandhidham",
    "bhuj", "veraval", "jetpur", "khambhat", "godhra", "dahod"
    ],

  uttar_pradesh: [
    "uttar pradesh", "united provinces", "up", "lucknow", "kanpur",
    "jhansi", "agra", "varanasi", "benaras", "allahabad", "prayagraj",
    // ADD THESE:
    "gorakhpur", "meerut", "ghaziabad", "noida", "firozabad",
    "mathura", "aligarh", "bareilly", "moradabad", "saharanpur",
    "shahjahanpur", "faizabad", "ayodhya", "chitrakoot", "mirzapur",
    "muzaffarnagar", "bulandshahr", "hamirpur", "badaun", "etawah",
    "kanpur dehat", "raebareli", "sultanpur", "bijnor", "deoria"
    ],

  madhya_pradesh: [
    "madhya pradesh",
    "central india",
    "bhopal",
    "indore",
    "gwalior",
    "malwa",
    "bundelkhand",
    // ADD THESE:
    "jabalpur", "ujjain", "sagar", "rewa", "satna", "katni",
    "ratlam", "mandsaur", "neemuch", "chhindwara", "khandwa",
    "burhanpur", "betul", "narsinghpur", "damoh", "panna",
    "chhatarpur", "tikamgarh", "niwari", "vidisha", "raisen",
    "sehore", "shajapur", "dewasa", "dhar", "barwani", "khargone",
    "harda", "hoshangabad", "pipariya", "itarsi", "nagda",
    "ujjain", "bhind", "morena", "sheopur", "datia", "ashoknagar",
    "guna", "shivpuri", "gwalior", "bhopal", "dewas", "khandwa",
    "singrauli", "sidhi", "shahdol", "anuppur", "dindori",
    "mandla", "seoni", "balaghat", "katni", "maihar", "amarpatan",
    "nagod", "mauganj", "hanumana", "mangawan", "raigarh",
    "basoda", "kurwai", "sironj", "bairasia", "berasia",
    "mandideep", "baktara", "goharganj", "obedullaganj",
    "kanadia", "char imli", "new market", "bhanpur", "piplani",
    "arera colony", "mp nagar", "kolar road", "hoshangabad road",
    "sanchi", "bhimbetka", "bhojpur", "mandu", "maheshwar",
    "omkareshwar", "mahakaleshwar", "kandariya mahadev", "khajuraho",
    "orchha", "datia", "sonagiri", "shivpuri", "kunwar",
    "gori ka bhag", "rahilgarh", "vidisha", "talbet", "hirapur"
    ],

  bihar: [
    "bihar",
    "bihari",
    "patna",
    "champaran",
    "magadh",
    "mithila",
    // ADD THESE:
    "gaya", "bhagalpur", "muzaffarpur", "purnia", "darbhanga",
    "begusarai", "arrah", "sasaram", "hajipur", "bettiah",
    "motihari", "siwan", "chapra", "gopalganj", "nawada",
    "aurangabad", "nalanda", "bihar sharif", "jahanabad",
    "bodh gaya", "vaishali", "sitamarhi", "sheohar", "madhubani",
    "samastipur", "khagaria", "saharsa", "madhepura", "supaul",
    "araria", "kishanganj", "katihar", "purnea", "forbesganj",
    "chhapra", "hajipur", "lalganj", "mahua", "patepur",
    "barh", "bakhtiyarpur", "maner", "danapur", "khagaul",
    "fatwah", "khusrupur", "bakhtiyarpur", "barharia",
    "mairwa", "jandaha", "runnisaidpur", "kanti", "minapur",
    "kudra", "mohania", "bhawanipur", "nokha", "sikariganj",
    "sahdei bigha", "bikramganj", "dehri", "akbarpur",
    "punpun", "ankisha", "bankipur", "kadamkuan", "kankarbagh",
    "rajendra nagar", "boring road", "buddha colony", "anandpuri",
    "rajgir", "nalanda", "vaishali", "kesariya", "champa",
    "muqaddarpur", "rahika", "karakat", "atehar", "khalispur"
    ],

  jharkhand: [
    "jharkhand",
    "chotanagpur",
    "chota nagpur",
    "ranchi",
    "santhal",
    // ADD THESE:
    "jamshedpur", "bokaro", "dhanbad", "hazaribagh", "giridih",
    "ramgarh", "deoghar", "chakradharpur", "simdega", "gumla",
    "khunti", "chaibasa", "saraikela", "koderma", "phusro",
    "mango", "adityapur", "gamharia", "sindri", "jharia",
    "bhowra", "kathara", "bhuli", "sijua", "putki", "kenduadih",
    "bagbera", "haldia", "nagri", "hatia", "tupudana",
    "argora", "bariatu", "bargain", "lalpur", "upper bazar",
    "lower bazar", "main road", "doranda", "kadru", "hindpiri",
    "morabadi", "bariyatu", "pandra", "kanke", "or manjhi",
    "pokhari", "kathikund", "silli", "tamad", "bano", "sonahatu",
    "silli", "bundu", "khunti", "torpa", "basia", "kolebira",
    "palkot", "bishunpur", "ghaghra", "lohardaga", "iskon",
    "rahe", "tamar", "pokharia", "gujhandi", "kandera",
    "muri", "kokar", "danghat", "kutchum", "majhgaon"
    ],

  delhi: [
    "delhi",
    "new delhi",
    "shahjahanabad",
    "indraprastha",
    // ADD THESE:
    "delhi ncr", "ncr", "national capital region",
    "old delhi", "chandni chowk", "red fort", "lal quila",
    "jhilmil", "shaheen bagh", "jamia nagar", "okhla",
    "kalkaji", "nehru place", "bhogal", "jangpura", "lajpat nagar",
    "south delhi", "gurgaon", "noida", "ghaziabad", "faridabad",
    "dwarka", "rohini", "pitampura", "karol bagh", "paharganj",
    "connaught place", "cp", "india gate", "rashtrapati bhavan",
    "parliament house", "janpath", "rajpath", "sansad marg",
    "chanakyapuri", "diplomatic enclave", "vijay chowk",
    "patel chowk", "mandi house", "tilak marg", "ashoka road",
    "lodhi road", "safdarjung", "jorbagh", "golf links",
    "greater kailash", "south extension", "defence colony",
    "pocket", "jahar", "zamrudpur", "chittaranjan park",
    "kirti nagar", "rajouri garden", "paschim vihar", "punjabi bagh",
    "model town", "ashok vihar", "shalimar bagh", "azadpur",
    "adarsh nagar", "kingsway camp", "civil lines", "kashmere gate",
    "mori gate", "lahori gate", "ajmeri gate", "turkman gate",
    "delhi gate", "daryaganj", "jama masjid", "nizzamuddin",
    "hauz khas", "green park", "saket", "mehrauli", "qutub minar",
    "lotus temple", "akshardham", "purana qila", "jantar mantar"
    ],

  kashmir: [
    "kashmir",
    "jammu",
    "ladakh",
    "srinagar",
    "dogra",
    // ADD THESE:
    // Jammu region:
    "jammu city", "kathua", "samba", "udhampur", "reasi",
    "rajouri", "poonch", "doda", "kishtwar", "ramban",
    "akhnoor", "jammu", "domana", "bishnah", "rs pura",
    "samba", "nau shehra", "ramgarh", "bari brahmna",
    "hiranagar", "lakhanpur", "bilawar", "basantgarh",
    "doda", "bhaderwah", "thatri", "marmat", "chenab",
    "kishtwar", "paddar", "warwan", "sondar", "chhatroo",
    "bandipora", "baramulla", "kupwara", "ganderbal",
    "pulwama", "shopian", "kulgam", "anantnag",
    // Kashmir valley:
    "gulmarg", "pahalgam", "sonamarg", "dachigam", "khilanmarg",
    "tulail", "gurez", "keran", "machil", "tithwal",
    "handwara", "langate", "kupwara", "trehgam", "sogam",
    "haval", "bandipora", "sumbal", "patan", "dachigam",
    "kangan", "sonamarg", "manasbal", "naranag", "gangabal",
    "lolab", "buniyar", "kashmir valley", "vale of kashmir",
    "shankaracharya hill", "hari parbat", "dal lake", "nagin lake",
    "garden of babur", "char chinar", "hazratbal", "shalimar bagh",
    "nishat garden", "chashme shahi", "pari mahal", "jangermarg",
    // Ladakh:
    "leh", "kargil", "zanskar", "nubra valley", "shyok",
    "dras", "kargil town", "sankoo", "taisuru", "purig",
    "suru valley", "shargole", "kharbu", "garkon", "pashkyum",
    "padum", "karsha", "zangla", "nyoma", "durbuk", "tangtse",
    "khardung la", "changthang", "pangong tso", "tsomoriri",
    "tsokar", "korzok", "chemrey", "thiksey", "hemis",
    "stok", "spituk", "matho", "stakna",
    ],

  northeast_india: [
    "nagaland",
    "manipur",
    "mizoram",
    "tripura",
    "meghalaya",
    "arunachal",
    "northeast",
    "north east",
  ],

  // Add these new categories:
    eastern_india: [
    "eastern india", "east india", "bihar", "jharkhand", "odisha", 
    "west bengal", "assam", "northeast"
    ],
    north_india: [
    "north india", "northern india", "jammu", "kashmir", "haryana",
    "himachal", "punjab", "uttarakhand", "uttar pradesh", "delhi"
    ],
    south_india: [
    "south india", "southern india", "tamil nadu", "karnataka",
    "kerala", "andhra pradesh", "telangana", "goa", "pondicherry"
    ],
    western_india: [
    "western india", "west india", "gujarat", "maharashtra",
    "rajasthan", "madhya pradesh", "daman", "diu", "dadra", "nagar haveli"
    ],
    central_india: [
    "central india", "madhya pradesh", "madhya pradesh", "bhopal",
    "indore", "gwalior", "jabalpur", "ujjain", "chhattisgarh"
    ],
};

/*
 * ============================================================
 * SUBJECT KEYWORDS
 * ============================================================
 */

const SUBJECT_KEYWORDS: Record<
  string,
  string[]
> = {
  freedom_struggle: [
    "freedom",
    "independence",
    "independence movement",
    "freedom fighter",
    "freedom struggle",
    "quit india",
    "civil disobedience",
    "non cooperation",
    "salt satyagraha",
    "satyagraha",
    "revolutionary",
    "martyr",
    "swadeshi",
    "british",
    "colonial",
  ],

  military: [
    "battle",
    "war",
    "army",
    "military",
    "soldier",
    "commander",
    "general",
    "fort",
    "siege",
    "campaign",
  ],

  ancient_history: [
    "ancient",
    "maurya",
    "gupta",
    "vedic",
    "ashoka",
    "chola",
    "pallava",
    "satavahana",
  ],

  medieval_history: [
    "medieval",
    "sultanate",
    "mughal",
    "rajput",
    "maratha",
    "ahom",
    "vijayanagara",
    "kingdom",
    "empire",
  ],

  modern_history: [
    "modern",
    "british india",
    "colonial",
    "1857",
    "revolt",
    "revolution",
    "independence",
  ],
};

/*
 * ============================================================
 * NORMALIZATION
 * ============================================================
 */

function normalize(
  value: string
): string {
  return value
    .toLowerCase()
    .replace(
      /[^a-z0-9\s-]/g,
      " "
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();
}

/*
 * ============================================================
 * KEYWORD MATCHING
 * ============================================================
 */

function containsKeyword(
  text: string,
  keyword: string
): boolean {
  const normalizedText =
    normalize(text);

  const normalizedKeyword =
    normalize(keyword);

  if (!normalizedKeyword) {
    return false;
  }

  if (
    normalizedKeyword.length <= 3
  ) {
    const words =
      normalizedText.split(
        /\s+/
      );

    return words.includes(
      normalizedKeyword
    );
  }

  return normalizedText.includes(
    normalizedKeyword
  );
}

function detectHistoricalPeriod(
  text: string
): string | null {
  const normalized = normalize(text);

  const scores: Record<string, number> = {
    ancient_history: 0,
    medieval_history: 0,
    modern_history: 0,
  };

  const ancientKeywords = [
    "ancient india",
    "ancient indian",
    "maurya",
    "mauryan",
    "gupta empire",
    "gupta dynasty",
    "vedic period",
    "vedic age",
    "ashoka",
    "satavahana",
    "pallava dynasty",
    "chola dynasty",
  ];

  const medievalKeywords = [
    "medieval india",
    "medieval indian",
    "delhi sultanate",
    "mughal empire",
    "mughal",
    "maratha empire",
    "ahom kingdom",
    "ahom",
    "vijayanagara empire",
    "rajput kingdom",
    "rajputana",
    "sultanate",
  ];

  const modernKeywords = [
    "british india",
    "british raj",
    "indian independence movement",
    "indian independence",
    "independence movement",
    "freedom struggle",
    "freedom fighter",
    "quit india",
    "civil disobedience",
    "non cooperation movement",
    "salt satyagraha",
    "salt march",
    "revolt of 1857",
    "indian rebellion of 1857",
    "sepoy mutiny",
    "colonial india",
    "colonial rule",
  ];

  for (const keyword of ancientKeywords) {
    if (containsKeyword(normalized, keyword)) {
      scores.ancient_history += 3;
    }
  }

  for (const keyword of medievalKeywords) {
    if (containsKeyword(normalized, keyword)) {
      scores.medieval_history += 3;
    }
  }

  for (const keyword of modernKeywords) {
    if (containsKeyword(normalized, keyword)) {
      scores.modern_history += 3;
    }
  }

  const ranked = Object.entries(scores)
    .sort((a, b) => b[1] - a[1]);

  const best = ranked[0];

  if (!best || best[1] < 3) {
    return null;
  }

  return best[0];
}

/*
 * ============================================================
 * ENTITY SUBJECT HINTS
 * ============================================================
 */

function detectSubjectHints(
  entityType: EntityType,
  entityName: string,
  context: IdentityContext
): string[] {
  const text = normalize(
    [
      entityType,
      entityName,
      context.description,
      context.birthPlace || "",
      context.deathPlace || "",
      ...context.citizenship,
      ...context.occupations,
      ...context.knownFor,
    ].join(" ")
  );

  const hints: string[] = [];

  /*
   * ============================================================
   * FREEDOM STRUGGLE
   * ============================================================
   */

  const freedomKeywords = [
    "freedom fighter",
    "freedom struggle",
    "indian independence",
    "indian independence movement",
    "independence movement",
    "quit india",
    "quit india movement",
    "civil disobedience",
    "non cooperation",
    "non cooperation movement",
    "salt satyagraha",
    "salt march",
    "satyagraha",
    "revolutionary",
    "revolutionary movement",
    "martyr",
    "swadeshi",
    "british india",
    "british raj",
  ];

  if (
    freedomKeywords.some((keyword) =>
      containsKeyword(text, keyword)
    )
  ) {
    hints.push("freedom_struggle");
  }

  /*
   * ============================================================
   * MILITARY
   * ============================================================
   */

  const militaryKeywords = [
    "battle",
    "war",
    "army",
    "military",
    "military leader",
    "military commander",
    "soldier",
    "commander",
    "general",
    "warrior",
    "fort",
    "siege",
    "campaign",
    "navy",
    "naval",
    "cavalry",
    "infantry",
  ];

  if (
    militaryKeywords.some((keyword) =>
      containsKeyword(text, keyword)
    )
  ) {
    hints.push("military");
  }

  /*
   * ============================================================
   * HISTORICAL PERIOD
   * ============================================================
   *
   * We deliberately select only the strongest historical
   * period instead of independently matching ancient,
   * medieval and modern keywords.
   */

  const historicalPeriod = detectHistoricalPeriod(text);

  if (historicalPeriod) {
    hints.push(historicalPeriod);
  }

  /*
   * ============================================================
   * WIKIDATA OCCUPATION CROSS-CHECK
   * ============================================================
   *
   * Occupation information can strengthen a subject category,
   * but should NOT determine geographical region.
   */

  for (const occupation of context.occupations) {
    const occ = normalize(occupation);

    if (
      occ.includes("soldier") ||
      occ.includes("military") ||
      occ.includes("general") ||
      occ.includes("commander") ||
      occ.includes("warrior") ||
      occ.includes("army")
    ) {
      if (!hints.includes("military")) {
        hints.push("military");
      }
    }

    if (
      occ.includes("freedom") ||
      occ.includes("independence") ||
      occ.includes("revolutionary") ||
      occ.includes("activist")
    ) {
      if (!hints.includes("freedom_struggle")) {
        hints.push("freedom_struggle");
      }
    }
  }

  /*
   * ============================================================
   * WIKIDATA "KNOWN FOR" CROSS-CHECK
   * ============================================================
   */

  for (const known of context.knownFor) {
    const knownText = normalize(known);

    if (
      knownText.includes("independence") ||
      knownText.includes("freedom") ||
      knownText.includes("revolution") ||
      knownText.includes("quit india") ||
      knownText.includes("civil disobedience")
    ) {
      if (!hints.includes("freedom_struggle")) {
        hints.push("freedom_struggle");
      }
    }

    if (
      knownText.includes("battle") ||
      knownText.includes("war") ||
      knownText.includes("military") ||
      knownText.includes("army")
    ) {
      if (!hints.includes("military")) {
        hints.push("military");
      }
    }
  }

  /*
   * ============================================================
   * EVENT
   * ============================================================
   */

  if (entityType === "event") {
    if (!hints.includes("historical_event")) {
      hints.push("historical_event");
    }
  }

  /*
   * Remove duplicates while preserving order.
   */

  return [...new Set(hints)];
}

/*
 * ============================================================
 * REGION DETECTION
 * ============================================================
 */

function detectRegionHints(
  entityName: string,
  context: IdentityContext
): string[] {
  const regionScores: Record<string, number> = {};

  for (const region of Object.keys(REGION_KEYWORDS)) {
    regionScores[region] = 0;
  }

  function addRegionScore(
    text: string,
    weight: number
  ) {
    const normalized = normalize(text);

    for (const [region, keywords] of Object.entries(
      REGION_KEYWORDS
    )) {
      for (const keyword of keywords) {
        if (containsKeyword(normalized, keyword)) {
          regionScores[region] += weight;
        }
      }
    }
  }

  /*
   * Strongest evidence
   */
  if (context.birthPlace) {
    addRegionScore(context.birthPlace, 10);
  }

  /*
   * Strong evidence
   */
  if (context.deathPlace) {
    addRegionScore(context.deathPlace, 6);
  }

  /*
   * Medium evidence
   */
  for (const citizenship of context.citizenship) {
    addRegionScore(citizenship, 5);
  }

  /*
   * Medium/weak evidence
   */
  for (const known of context.knownFor) {
    addRegionScore(known, 3);
  }

  /*
   * Entity name should have low influence.
   */
  addRegionScore(entityName, 2);

  /*
   * Never use occupation to infer geography.
   *
   * "military leader" does NOT tell us a region.
   */

  /*
   * Sort by score.
   */
  const ranked = Object.entries(regionScores)
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1]);

  if (ranked.length === 0) {
    return [];
  }

  /*
   * Keep only reasonably supported regions.
   *
   * A region must either have a strong score,
   * or be reasonably close to the strongest region.
   */
  const strongestScore = ranked[0][1];

  return ranked
    .filter(([region, score]) => {
      if (score >= 10) return true;

      if (
        score >= 5 &&
        score >= strongestScore * 0.5
      ) {
        return true;
      }

      return false;
    })
    .map(([region]) => region)
    .filter(
      (region) =>
        ![
          "eastern_india",
          "north_india",
          "south_india",
          "western_india",
          "central_india",
          "northeast_india",
        ].includes(region)
    );
}

/*
 * ============================================================
 * SOURCE RELEVANCE
 * ============================================================
 */

function calculateSourceRelevance(
  source: ResearchSourceDefinition,
  regionHints: string[],
  subjectHints: string[]
): number {
  let score = 0;

  // Global sources are always useful
  if (
    source.regions.includes(
      "global"
    )
  ) {
    score += 30;
  }

  // India-wide sources are useful for Indian historical entities
  if (
    source.regions.includes(
      "india"
    )
  ) {
    score += 35;
  }

  // Regional relevance
  for (
    const region of regionHints
  ) {
    if (
      source.regions.includes(
        region
      )
    ) {
      score += 50;
    }

    // Some regional sources may use broader geographical labels
    if (
      region === "bengal" &&
      source.regions.includes(
        "eastern_india"
      )
    ) {
      score += 25;
    }
  }

  // Subject relevance
  for (
    const subject of subjectHints
  ) {
    if (
      source.subjects.some(
        (sourceSubject) =>
          normalize(
            sourceSubject
          ).includes(
            normalize(subject)
          ) ||
          normalize(
            subject
          ).includes(
            normalize(
              sourceSubject
            )
          )
      )
    ) {
      score += 20;
    }
  }

  // Authority contributes a smaller amount
  score +=
    source.authorityWeight *
    10;

  return score;
}

/*
 * ============================================================
 * DISCOVER SOURCES
 * ============================================================
 */

export async function discoverResearchSources(
  entityType: EntityType,
  entityName: string
): Promise<SourceDiscoveryResult> {
  const cleanName =
    entityName.trim();

  if (!cleanName) {
    throw new Error(
      "Entity name cannot be empty during source discovery."
    );
  }

  // Step 1: Resolve identity context from Wikipedia/Wikidata
  console.log("Resolving identity context from Wikipedia/Wikidata...");
  const context = await resolveIdentityContext(cleanName);

  // Step 2: Detect region hints using the enriched context
  const regionHints = detectRegionHints(cleanName, context);

  // Step 3: Detect subject hints using the enriched context
  const subjectHints = detectSubjectHints(entityType, cleanName, context);

  // Step 4: Get enabled sources
  const enabledSources = getEnabledResearchSources();

  // Step 5: Rank sources by relevance
  const rankedSources =
    enabledSources
      .map(
        (source) => ({
          source,
          score: calculateSourceRelevance(
            source,
            regionHints,
            subjectHints
          ),
        })
      )
      .sort(
        (a, b) =>
          b.score -
          a.score
      );

  // Step 6: Filter to relevant sources
  const sources =
    rankedSources
      .filter(
        ({ source, score }) =>
          source.regions.includes(
            "global"
          ) ||
          source.regions.includes(
            "india"
          ) ||
          score >= 20
      )
      .map(
        ({ source }) =>
          source
      );

  return {
    entityType,
    entityName: cleanName,
    regionHints,
    subjectHints,
    sources,
    identityContext: context,
  };
}

/*
 * ============================================================
 * PRINT DISCOVERY
 * ============================================================
 */

export function printSourceDiscovery(
  result: SourceDiscoveryResult
): void {
  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "SOURCE DISCOVERY"
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

  console.log("");

  console.log(
    `REGION HINTS : ${
      result.regionHints.length
        ? result.regionHints.join(
            ", "
          )
        : "NONE"
    }`
  );

  console.log(
    `SUBJECT HINTS : ${
      result.subjectHints.length
        ? result.subjectHints.join(
            ", "
          )
        : "NONE"
    }`
  );

  console.log("");

  // Print identity context if available
  if (result.identityContext) {
    console.log(
      "IDENTITY CONTEXT:"
    );
    console.log(
      `  Birth Place: ${result.identityContext.birthPlace || "Unknown"}`
    );
    console.log(
      `  Death Place: ${result.identityContext.deathPlace || "Unknown"}`
    );
    console.log(
      `  Citizenship: ${result.identityContext.citizenship.join(", ") || "Unknown"}`
    );
    console.log(
      `  Occupations: ${result.identityContext.occupations.join(", ") || "Unknown"}`
    );
    console.log(
      `  Known For: ${result.identityContext.knownFor.join(", ") || "Unknown"}`
    );
    console.log("");
  }

  console.log(
    `SELECTED SOURCES : ${result.sources.length}`
  );

  result.sources.forEach(
    (source, index) => {
      console.log("");
      console.log(
        `${index + 1}. ${source.name}`
      );

      console.log(
        `   AUTHORITY : ${source.authority}`
      );

      console.log(
        `   KIND      : ${source.kind}`
      );

      console.log(
        `   URL       : ${source.baseUrl}`
      );
    }
  );
}