import { Schema, model, models } from "mongoose";

const HeroSchema = new Schema(
  {
    /* ===========================
       BASIC INFORMATION
    =========================== */

    heroId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    nativeName: {
      type: String,
      default: "",
      trim: true,
    },

    alternativeNames: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: [],
    },

    title: {
      type: String,
      default: "",
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    birthDate: {
      type: Date,
      default: null,
    },

    birthDateAccuracy: {
      type: String,
      enum: ["Exact", "Approximate", "Unknown"],
      default: "Unknown",
    },

    deathDate: {
      type: Date,
      default: null,
    },

    deathDateAccuracy: {
      type: String,
      enum: ["Exact", "Approximate", "Unknown"],
      default: "Unknown",
    },

    birthPlaceId: {
      type: Schema.Types.ObjectId,
      ref: "Place",
      default: null,
    },

    deathPlaceId: {
      type: Schema.Types.ObjectId,
      ref: "Place",
      default: null,
    },

    causeOfDeath: {
      type: String,
      default: "",
      trim: true,
    },

    nickname: {
      type: String,
      default: "",
      trim: true,
    },

    personalityTraits: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: [],
    },

    legacy: {
      type: String,
      default: "",
      trim: true,
    },

    historicalAssessments: {
      type: Map,
      of: String,
      default: {},
    },

    biography: {
      type: String,
      required: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      default: "",
      trim: true,
    },

    knownFor: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: [],
    },

    occupation: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: [],
    },

    roles: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: [],
    },

    languagesKnown: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: [],
    },

    education: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: [],
    },

    religion: {
      type: String,
      default: "",
    },

    coronationDate: {
      type: Date,
      default: null,
    },

    predecessorId: {
      type: Schema.Types.ObjectId,
      ref: "Hero",
      default: null,
    },

    successorId: {
      type: Schema.Types.ObjectId,
      ref: "Hero",
      default: null,
    },

    officialSeal: {
      type: String,
      default: "",
    },

    coins: {
      type: [
        {
          type: String,
        },
      ],
      default: [],
    },

    administrativeReforms: {
      type: [
        {
          type: String,
        },
      ],
      default: [],
    },

    economicReforms: {
      type: [
        {
          type: String,
        },
      ],
      default: [],
    },

    /* ===========================
       FAMILY
    =========================== */

    fatherId: {
      type: Schema.Types.ObjectId,
      ref: "Hero",
      default: null,
    },

    motherId: {
      type: Schema.Types.ObjectId,
      ref: "Hero",
      default: null,
    },

    brothers: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Hero",
        },
      ],
      default: [],
    },

    sisters: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Hero",
        },
      ],
      default: [],
    },

    spouseIds: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Hero",
        },
      ],
      default: [],
    },

    childrenIds: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Hero",
        },
      ],
      default: [],
    },

    dynastyId: {
      type: Schema.Types.ObjectId,
      ref: "Dynasty",
      default: null,
    },

    clan: {
      type: String,
      default: "",
      trim: true,
    },
    
    /* ===========================
       MILITARY
    =========================== */

    primaryWeaponIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "Weapon" }],
      default: [],
    },

    preferredWeapons: {
      type: [{ type: Schema.Types.ObjectId, ref: "Weapon" }],
      default: [],
    },

    warAnimalId: {
      type: Schema.Types.ObjectId,
      ref: "WarAnimal",
      default: null,
    },

    armySize: {
      type: Number,
      default: null,
    },

    commanderOf: {
      type: [{ type: Schema.Types.ObjectId, ref: "Battle" }],
      default: [],
    },

    warStrategyIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "WarStrategy" }],
      default: [],
    },

    militaryTactics: {
      type: [
      {
      type: String,
      trim: true,
      },
      ],
      default: [],
    },

    notableFeats: {
      type: [
      {
      type: String,
      trim: true,
      },
      ],
      default: [],
    },

    rank: {
      type: String,
      default: "",
    },

    /* ===========================
       POLITICAL
    =========================== */

    kingdomId: {
      type: Schema.Types.ObjectId,
      ref: "Kingdom",
      required: true,
    },

    capitalId: {
      type: Schema.Types.ObjectId,
      ref: "Place",
      default: null,
    },

    reignPeriod: {
      type: String,
      default: "",
    },

    territoryControlled: {
      type: [{ type: Schema.Types.ObjectId, ref: "Place" }],
      default: [],
    },

    territoriesLost: {
      type: [{ type: Schema.Types.ObjectId, ref: "Place" }],
      default: [],
    },

    territoriesRecaptured: {
      type: [{ type: Schema.Types.ObjectId, ref: "Place" }],
      default: [],
    },

    historicalPeriodId: {
      type: Schema.Types.ObjectId,
      ref: "HistoricalPeriod",
      default: null,
    },

    /* ===========================
       CROSS REFERENCES
    =========================== */

    relatedHeroes: {
      type: [{ type: Schema.Types.ObjectId, ref: "Hero" }],
      default: [],
    },

    relatedBattles: {
      type: [{ type: Schema.Types.ObjectId, ref: "Battle" }],
      default: [],
    },

    relatedPlaces: {
      type: [{ type: Schema.Types.ObjectId, ref: "Place" }],
      default: [],
    },

    relatedBooks: {
      type: [{ type: Schema.Types.ObjectId, ref: "Book" }],
      default: [],
    },

    relatedSources: {
      type: [{ type: Schema.Types.ObjectId, ref: "Source" }],
      default: [],
    },

    relatedImages: {
      type: [{ type: Schema.Types.ObjectId, ref: "Image" }],
      default: [],
    },

    /* ===========================
       CONTENT
    =========================== */

    achievements: {
      type: [
      {
      type: String,
      trim: true,
      },
      ],
      default: [],
    },

    quoteIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "Quote" }],
      default: [],
    },

    imageIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "Image" }],
      default: [],
    },

    museumId: {
      type: Schema.Types.ObjectId,
      ref: "Museum",
      default: null,
    },

    exhibitionIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "Exhibition" }],
      default: [],
    },

    memorialId: {
      type: Schema.Types.ObjectId,
      ref: "Memorial",
      default: null,
    },

    bookIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "Book" }],
      default: [],
    },

    sourceIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "Source" }],
      default: [],
    },

    tags: {
      type: [
      {
      type: String,
      trim: true,
      },
      ],
      default: [],
    },

    /* ===========================
       SEARCH
    =========================== */

    searchFields: {
      keywords: {
        type: [
        {
        type: String,
        trim: true,
        },
        ],
        default: [],
      },

      nativeSpellings: {
        type: [
        {
        type: String,
        trim: true,
        },
        ],
        default: [],
      },

      alternateSpellings: {
        type: [
        {
        type: String,
        trim: true,
        },
        ],
        default: [],
      },

      aliases: {
        type: [
        {
        type: String,
        trim: true,
        },
        ],
        default: [],
      },
    },

    /* ===========================
       METADATA
    =========================== */

    metadata: {
      createdBy: {
        type: String,
        default: "",
      },

      verifiedBy: {
        type: String,
        default: "",
      },

      version: {
        type: Number,
        default: 1,
      },
    },

    status: {
      type: String,
      enum: ["Draft", "Verified", "Published", "Needs Review"],
      default: "Draft",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "heroes",
  }
);

HeroSchema.index({ heroId: 1 });
HeroSchema.index({ name: 1 });
HeroSchema.index({ kingdomId: 1 });
HeroSchema.index({ historicalPeriodId: 1 });
HeroSchema.index({ tags: 1 });

const Hero = models.Hero || model("Hero", HeroSchema);

export default Hero;