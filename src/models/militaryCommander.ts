import { Schema, model, models } from "mongoose";

const MilitaryCommanderSchema = new Schema(
  {
    commanderId: {
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

    title: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      enum: ["Commander", "Officer", "Vassal", "General"],
      index: true,
    },

    kingdomId: {
      type: Schema.Types.ObjectId,
      ref: "Kingdom",
      required: true,
      index: true,
    },

    allegiance: {
      type: String,
      trim: true,
    },

    relationship: {
      type: String,
      trim: true,
    },

    notableBattleIds: [
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

MilitaryCommanderSchema.index({
  name: "text",
  title: "text",
  allegiance: "text",
  tags: "text",
});

export default models.MilitaryCommander ||
  model("MilitaryCommander", MilitaryCommanderSchema);