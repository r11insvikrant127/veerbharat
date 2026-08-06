import { Schema, model, models } from "mongoose";

const WarStrategySchema = new Schema(
  {
    strategyId: {
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

    type: {
      type: String,
      required: true,
      enum: [
        "Guerrilla",
        "Conventional",
        "Terrain-based",
        "Deception",
        "Psychological",
      ],
      index: true,
    },

    keyPrinciples: [
      {
        type: String,
        trim: true,
      },
    ],

    usedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "Hero",
      },
    ],

    usedInBattles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Battle",
      },
    ],

    description: {
      type: String,
      required: true,
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
        required: true,
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

      relatedBattles: [
        {
          type: Schema.Types.ObjectId,
          ref: "Battle",
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

WarStrategySchema.index({
  name: "text",
  nativeName: "text",
  keyPrinciples: "text",
  tags: "text",
});

export default models.WarStrategy ||
  model("WarStrategy", WarStrategySchema);