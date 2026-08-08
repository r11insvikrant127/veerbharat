import { Schema, model, models } from "mongoose";

const KingdomSchema = new Schema(
  {
    /* ===========================
       BASIC INFORMATION
    =========================== */

    kingdomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
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

    establishedDate: {
      type: Date,
      default: null,
    },

    establishedDateAccuracy: {
      type: String,
      enum: [
        "Exact",
        "Approximate",
        "Unknown",
      ],
      default: "Unknown",
    },

    dissolvedDate: {
      type: Date,
      default: null,
    },

    dissolvedDateAccuracy: {
      type: String,
      enum: [
        "Exact",
        "Approximate",
        "Unknown",
      ],
      default: "Unknown",
    },

    /* ===========================
       RULERS
    =========================== */

    capitalId: {
      type: Schema.Types.ObjectId,
      ref: "Place",
      default: null,
    },

    dynastyId: {
      type: Schema.Types.ObjectId,
      ref: "Dynasty",
      default: null,
    },

    founderId: {
      type: Schema.Types.ObjectId,
      ref: "Hero",
      default: null,
    },

    lastRulerId: {
      type: Schema.Types.ObjectId,
      ref: "Hero",
      default: null,
    },

    /* ===========================
       KINGDOM DETAILS
    =========================== */

    area: {
      type: String,
      default: "",
      trim: true,
    },

    flagImageId: {
      type: Schema.Types.ObjectId,
      ref: "Image",
      default: null,
    },

    emblemImageId: {
      type: Schema.Types.ObjectId,
      ref: "Image",
      default: null,
    },

    governmentType: {
      type: String,
      default: "",
      trim: true,
    },

    currencies: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: [],
    },

    officialLanguages: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: [],
    },

    officialReligions: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: [],
    },

    nationalAnimal: {
      type: String,
      default: "",
      trim: true,
    },

    nationalSymbols: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: [],
    },

    /* ===========================
       GEOGRAPHY
    =========================== */

    majorCities: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Place",
        },
      ],
      default: [],
    },

    majorForts: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Fort",
        },
      ],
      default: [],
    },

    historicalPeriodId: {
      type: Schema.Types.ObjectId,
      ref: "HistoricalPeriod",
      default: null,
    },

    /* ===========================
       CONTENT
    =========================== */

    description: {
      type: String,
      required: true,
      trim: true,
    },

    significance: {
      type: String,
      default: "",
      trim: true,
    },

    imageIds: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Image",
        },
      ],
      default: [],
    },

    sourceIds: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Source",
        },
      ],
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
       CROSS REFERENCES
    =========================== */

    crossReferences: {
      relatedHeroes: {
        type: [
          {
            type: Schema.Types.ObjectId,
            ref: "Hero",
          },
        ],
        default: [],
      },

      relatedBattles: {
        type: [
          {
            type: Schema.Types.ObjectId,
            ref: "Battle",
          },
        ],
        default: [],
      },

      relatedPlaces: {
        type: [
          {
            type: Schema.Types.ObjectId,
            ref: "Place",
          },
        ],
        default: [],
      },

      relatedBooks: {
        type: [
          {
            type: Schema.Types.ObjectId,
            ref: "Book",
          },
        ],
        default: [],
      },
    },
        /* ===========================
       SEARCH
    =========================== */

    searchFields: {
      keywords: {
        type: [String],
        default: [],
      },

      nativeSpellings: {
        type: [String],
        default: [],
      },

      alternateSpellings: {
        type: [String],
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
  }
);

/* ===========================
   INDEXES
=========================== */

KingdomSchema.index({ dynastyId: 1 });
KingdomSchema.index({ founderId: 1 });
KingdomSchema.index({ historicalPeriodId: 1 });
KingdomSchema.index({ tags: 1 });

const Kingdom =
  models.Kingdom || model("Kingdom", KingdomSchema);

export default Kingdom;