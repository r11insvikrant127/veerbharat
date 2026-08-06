import { Schema, model, models } from "mongoose";

const FortSchema = new Schema(
  {
    fortId: {
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

    locationId: {
      type: Schema.Types.ObjectId,
      ref: "Place",
      required: true,
      index: true,
    },

    constructionDate: {
      type: Date,
      default: null,
    },

    constructionDateAccuracy: {
      type: String,
      enum: [
        "Exact",
        "Approximate",
        "Unknown",
      ],
      default: "Unknown",
},

    builderId: {
      type: Schema.Types.ObjectId,
      ref: "Hero",
      index: true,
    },

    kingdomId: {
      type: Schema.Types.ObjectId,
      ref: "Kingdom",
      index: true,
    },

    architectureStyle: {
      type: String,
      trim: true,
    },

    features: [
      {
        type: String,
        trim: true,
      },
    ],

    battles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Battle",
      },
    ],

    fortStatus: {
      type: String,
      enum: ["Active", "Ruins", "Restored"],
      index: true,
    },

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

      relatedPlaces: [
        {
          type: Schema.Types.ObjectId,
          ref: "Place",
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

FortSchema.index({
  name: "text",
  nativeName: "text",
  alternativeNames: "text",
  architectureStyle: "text",
  features: "text",
  tags: "text",
});

export default models.Fort || model("Fort", FortSchema);