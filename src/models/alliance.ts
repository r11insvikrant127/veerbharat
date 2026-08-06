import { Schema, model, models } from "mongoose";

const AllianceSchema = new Schema(
  {
    allianceId: {
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

    type: {
      type: String,
      required: true,
      enum: ["Military", "Tribal", "Family", "Political"],
      index: true,
    },

    parties: [
      {
        type: Schema.Types.ObjectId,
        refPath: "partyModel",
      },
    ],

    partyModel: {
      type: String,
      enum: ["Hero", "Tribe"],
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    notableContributions: [
      {
        type: String,
        trim: true,
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

      relatedTribes: [
        {
          type: Schema.Types.ObjectId,
          ref: "Tribe",
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

AllianceSchema.index({
  name: "text",
  description: "text",
  notableContributions: "text",
  tags: "text",
});

export default models.Alliance || model("Alliance", AllianceSchema);