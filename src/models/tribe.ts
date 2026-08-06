import { Schema, model, models } from "mongoose";

const TribeSchema = new Schema(
  {
    tribeId: {
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

    region: {
      type: String,
      trim: true,
      index: true,
    },

    historicalRole: {
      type: String,
      trim: true,
    },

    alliances: [
      {
        type: Schema.Types.ObjectId,
        ref: "Alliance",
      },
    ],

    description: {
      type: String,
      required: true,
      trim: true,
    },

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
      relatedAlliances: [
        {
          type: Schema.Types.ObjectId,
          ref: "Alliance",
        },
      ],

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

      relatedSources: [
        {
          type: Schema.Types.ObjectId,
          ref: "Source",
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

TribeSchema.index({
  name: "text",
  nativeName: "text",
  region: "text",
  historicalRole: "text",
  tags: "text",
});

export default models.Tribe || model("Tribe", TribeSchema);