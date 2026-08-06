import { Schema, model, models } from "mongoose";

const MuseumSchema = new Schema(
  {
    museumId: {
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

    locationId: {
      type: Schema.Types.ObjectId,
      ref: "Place",
      required: true,
      index: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["Museum", "Memorial", "Cultural Center"],
      index: true,
    },

    dedicatedTo: [
      {
        type: Schema.Types.ObjectId,
        ref: "Hero",
      },
    ],

    description: {
      type: String,
      required: true,
      trim: true,
    },

    highlights: [
      {
        type: String,
        trim: true,
      },
    ],

    openingHours: {
      type: String,
      trim: true,
    },

    entryFee: {
      type: String,
      trim: true,
    },

    website: {
      type: String,
      trim: true,
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

      relatedPlaces: [
        {
          type: Schema.Types.ObjectId,
          ref: "Place",
        },
      ],

      relatedExhibitions: [
        {
          type: Schema.Types.ObjectId,
          ref: "Exhibition",
        },
      ],

      relatedWeapons: [
        {
          type: Schema.Types.ObjectId,
          ref: "Weapon",
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

MuseumSchema.index({
  name: "text",
  nativeName: "text",
  description: "text",
  highlights: "text",
  tags: "text",
});

export default models.Museum || model("Museum", MuseumSchema);