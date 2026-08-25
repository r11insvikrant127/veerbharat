import { Schema, model, models } from "mongoose";

const ImageSchema = new Schema(
  {
    imageId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    altText: {
      type: String,
      required: true,
      trim: true,
    },

    imageType: {
      type: String,
      required: true,
      enum: [
        "Painting",
        "Portrait",
        "Photograph",
        "Statue",
        "Map",
        "Coin",
        "Weapon",
        "Inscription",
        "Fort",
        "Manuscript",
        "Stamp",
      ],
      index: true,
    },

    description: {
      type: String,
      trim: true,
    },

    artist: {
      type: String,
      trim: true,
    },

    period: {
      type: String,
      trim: true,
    },

    license: {
      type: String,
      trim: true,
    },

    copyright: {
      type: String,
      trim: true,
    },

    photographer: {
      type: String,
      trim: true,
    },

    painting: {
      type: Boolean,
      default: false,
    },

    aiGenerated: {
      type: Boolean,
      default: false,
    },

    restored: {
      type: Boolean,
      default: false,
    },

    yearCreated: {
      type: String,
      trim: true,
    },

    sourceId: {
      type: Schema.Types.ObjectId,
      ref: "Source",
      index: true,
    },

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

      relatedBattles: [
        {
          type: Schema.Types.ObjectId,
          ref: "Battle",
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

ImageSchema.index({ title: "text", altText: "text", tags: "text" });

export default models.Image || model("Image", ImageSchema);