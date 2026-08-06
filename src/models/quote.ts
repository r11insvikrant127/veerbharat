import { Schema, model, models } from "mongoose";

const QuoteSchema = new Schema(
  {
    quoteId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    language: {
      type: String,
      trim: true,
    },

    translation: {
      type: String,
      trim: true,
    },

    context: {
      type: String,
      trim: true,
    },

    heroId: {
      type: Schema.Types.ObjectId,
      ref: "Hero",
      index: true,
    },

    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      index: true,
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

      relatedEvents: [
        {
          type: Schema.Types.ObjectId,
          ref: "Event",
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

QuoteSchema.index({
  text: "text",
  translation: "text",
  context: "text",
  tags: "text",
});

export default models.Quote || model("Quote", QuoteSchema);