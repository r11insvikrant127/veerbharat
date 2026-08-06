import { Schema, model, models } from "mongoose";

const BookSchema = new Schema(
  {
    bookId: {
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

    bookType: {
      type: String,
      required: true,
      enum: [
        "Biography",
        "Chronicle",
        "Research",
        "Travel Account",
        "Archaeology",
        "Inscription Study",
        "Government Publication",
      ],
      index: true,
    },

    author: {
      type: String,
      trim: true,
      index: true,
    },

    language: {
      type: String,
      trim: true,
    },

    period: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    subjects: [
      {
        type: String,
        trim: true,
      },
    ],

    heroesMentioned: [
      {
        type: Schema.Types.ObjectId,
        ref: "Hero",
      },
    ],

    battlesMentioned: [
      {
        type: Schema.Types.ObjectId,
        ref: "Battle",
      },
    ],

    pdfUrl: {
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

      relatedKingdoms: [
        {
          type: Schema.Types.ObjectId,
          ref: "Kingdom",
        },
      ],

      relatedEvents: [
        {
          type: Schema.Types.ObjectId,
          ref: "Event",
        },
      ],

      relatedDynasties: [
        {
          type: Schema.Types.ObjectId,
          ref: "Dynasty",
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

BookSchema.index({
  title: "text",
  author: "text",
  subjects: "text",
  tags: "text",
});

export default models.Book || model("Book", BookSchema);