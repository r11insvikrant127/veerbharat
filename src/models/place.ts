import { Schema, model, models } from "mongoose";

const PlaceSchema = new Schema(
  {
    placeId: {
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
    },

    alternativeNames: [
      {
        type: String,
        trim: true,
      },
    ],

    type: {
      type: String,
      required: true,
      enum: [
        "City",
        "Village",
        "Fort",
        "Hill",
        "Valley",
        "Pass",
        "Canal",
        "River",
      ],
      index: true,
    },

    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90,
      },

      longitude: {
        type: Number,
        min: -180,
        max: 180,
      },
    },

    state: {
      type: String,
      trim: true,
      index: true,
    },

    country: {
      type: String,
      trim: true,
      default: "India",
    },

    region: {
      type: String,
      trim: true,
      index: true,
    },

    significance: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    historicalPeriodId: {
      type: Schema.Types.ObjectId,
      ref: "HistoricalPeriod",
      index: true,
    },

    imageIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Image",
      },
    ],

    sourceIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Source",
      },
    ],

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    crossReferences: {
      relatedHeroes: [
        {
          type: Schema.Types.ObjectId,
          ref: "Hero",
        },
      ],

      relatedKingdoms: [
        {
          type: Schema.Types.ObjectId,
          ref: "Kingdom",
        },
      ],

      relatedBattles: [
        {
          type: Schema.Types.ObjectId,
          ref: "Battle",
        },
      ],

      relatedEvents: [
        {
          type: Schema.Types.ObjectId,
          ref: "Event",
        },
      ],

      relatedForts: [
        {
          type: Schema.Types.ObjectId,
          ref: "Fort",
        },
      ],

      relatedMuseums: [
        {
          type: Schema.Types.ObjectId,
          ref: "Museum",
        },
      ],

      relatedSources: [
        {
          type: Schema.Types.ObjectId,
          ref: "Source",
        },
      ],

      relatedImages: [
        {
          type: Schema.Types.ObjectId,
          ref: "Image",
        },
      ],
    },

    searchFields: {
      keywords: [
        {
          type: String,
          trim: true,
        },
      ],

      nativeSpellings: [
        {
          type: String,
          trim: true,
        },
      ],

      alternateSpellings: [
        {
          type: String,
          trim: true,
        },
      ],

      aliases: [
        {
          type: String,
          trim: true,
        },
      ],
    },

    metadata: {
      createdBy: {
        type: String,
        trim: true,
      },

      verifiedBy: {
        type: String,
        trim: true,
      },

      version: {
        type: Number,
        default: 1,
      },
    },

    status: {
      type: String,
      required: true,
      enum: ["Draft", "Verified", "Published", "Needs Review"],
      default: "Draft",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

PlaceSchema.index({
  name: "text",
  nativeName: "text",
  alternativeNames: "text",
  tags: "text",
});

export default models.Place || model("Place", PlaceSchema);