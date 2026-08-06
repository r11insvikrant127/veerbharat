import { Schema, model, models } from "mongoose";

const SourceSchema = new Schema(
  {
    sourceId: {
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

    type: {
      type: String,
      required: true,
      enum: [
        "Book",
        "Research Paper",
        "Government Record",
        "ASI",
        "Museum",
        "Archive",
        "Inscription",
        "Travel Account",
        "Chronicle",
        "Manuscript",
      ],
      index: true,
    },

    author: {
      type: String,
      trim: true,
    },

    language: {
      type: String,
      trim: true,
    },

    year: {
      type: String,
      trim: true,
    },

    publisher: {
      type: String,
      trim: true,
    },

    edition: {
      type: String,
      trim: true,
    },

    isbn: {
      type: String,
      trim: true,
      index: true,
    },

    pages: {
      type: Number,
      min: 1,
    },

    volume: {
      type: String,
      trim: true,
    },

    publicationYear: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    reliability: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
      index: true,
    },

    location: {
      type: String,
      trim: true,
    },

    url: {
      type: String,
      trim: true,
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

      relatedBooks: [
        {
          type: Schema.Types.ObjectId,
          ref: "Book",
        },
      ],

      relatedBattles: [
        {
          type: Schema.Types.ObjectId,
          ref: "Battle",
        },
      ],

      relatedKingdoms: [
        {
          type: Schema.Types.ObjectId,
          ref: "Kingdom",
        },
      ],

      relatedPlaces: [
        {
          type: Schema.Types.ObjectId,
          ref: "Place",
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

SourceSchema.index({
  title: "text",
  author: "text",
  tags: "text",
});

export default models.Source || model("Source", SourceSchema);