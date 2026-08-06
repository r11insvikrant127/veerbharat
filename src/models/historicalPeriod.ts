import { Schema, model, models } from "mongoose";

const HistoricalPeriodSchema = new Schema(
  {
    periodId: {
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
      trim: true,
      default: "",
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

    startYear: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    endYear: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    duration: {
      type: String,
      trim: true,
      default: "",
    },

    precededBy: {
      type: Schema.Types.ObjectId,
      ref: "HistoricalPeriod",
      default: null,
    },

    succeededBy: {
      type: Schema.Types.ObjectId,
      ref: "HistoricalPeriod",
      default: null,
    },

    keyCharacteristics: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: [],
    },

    majorDynasties: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Dynasty",
        },
      ],
      default: [],
    },

    majorKingdoms: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Kingdom",
        },
      ],
      default: [],
    },

    majorHeroes: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Hero",
        },
      ],
      default: [],
    },

    majorEvents: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Event",
        },
      ],
      default: [],
    },

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
      required: true,
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

HistoricalPeriodSchema.index({ name: 1 });
HistoricalPeriodSchema.index({ startYear: 1 });
HistoricalPeriodSchema.index({ endYear: 1 });

const HistoricalPeriod =
  models.HistoricalPeriod ||
  model("HistoricalPeriod", HistoricalPeriodSchema);

export default HistoricalPeriod;