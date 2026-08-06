import { Schema, model, models } from "mongoose";

const MemorialSchema = new Schema(
  {
    memorialId: {
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
        "Smarak",
        "Chatri",
        "Monument",
        "Tourist Attraction",
        "Museum",
      ],
      index: true,
    },

    locationId: {
      type: Schema.Types.ObjectId,
      ref: "Place",
      required: true,
      index: true,
    },

    dedicatedTo: [
      {
        type: Schema.Types.ObjectId,
        refPath: "dedicatedToModel",
      },
    ],

    dedicatedToModel: {
      type: String,
      enum: ["Hero", "WarAnimal"],
    },

    builtBy: {
      type: Schema.Types.ObjectId,
      ref: "Hero",
      index: true,
    },

    yearBuilt: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    significance: {
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

      relatedWarAnimals: [
        {
          type: Schema.Types.ObjectId,
          ref: "WarAnimal",
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

MemorialSchema.index({
  name: "text",
  nativeName: "text",
  description: "text",
  significance: "text",
  tags: "text",
});

export default models.Memorial || model("Memorial", MemorialSchema);