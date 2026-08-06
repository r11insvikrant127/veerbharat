import { Schema, model, models } from "mongoose";

const ExhibitionSchema = new Schema(
  {
    exhibitionId: {
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

    description: {
      type: String,
      required: true,
      trim: true,
    },

    museumId: {
      type: Schema.Types.ObjectId,
      ref: "Museum",
      required: true,
      index: true,
    },

    heroIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Hero",
      },
    ],

    theme: {
      type: String,
      trim: true,
    },

    imageIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Image",
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

      relatedMuseums: [
        {
          type: Schema.Types.ObjectId,
          ref: "Museum",
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

ExhibitionSchema.index({
  name: "text",
  description: "text",
  theme: "text",
  tags: "text",
});

export default models.Exhibition ||
  model("Exhibition", ExhibitionSchema);