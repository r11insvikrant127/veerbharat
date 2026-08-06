import { Schema, model, models } from "mongoose";

const WeaponSchema = new Schema(
  {
    weaponId: {
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

    category: {
      type: String,
      required: true,
      enum: [
        "Sword",
        "Spear",
        "Shield",
        "Bow",
        "Arrow",
        "Armour",
        "Firearm",
      ],
      index: true,
    },

    subCategory: {
      type: String,
      trim: true,
    },

    material: {
      type: String,
      trim: true,
    },

    weight: {
      type: String,
      trim: true,
    },

    length: {
      type: String,
      trim: true,
    },

    origin: {
      type: String,
      trim: true,
    },

    effectiveRange: {
      type: String,
      trim: true,
    },

    manufacturingMethod: {
      type: String,
      trim: true,
    },

    eraUsed: {
      type: Schema.Types.ObjectId,
      ref: "HistoricalPeriod",
      index: true,
    },

    replicaExists: {
      type: Boolean,
      default: false,
    },

    museumAvailability: [
      {
        type: Schema.Types.ObjectId,
        ref: "Museum",
      },
    ],

    associatedHeroes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Hero",
      },
    ],

    associatedKingdoms: [
      {
        type: Schema.Types.ObjectId,
        ref: "Kingdom",
      },
    ],

    usedInBattles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Battle",
      },
    ],

    specialFeatures: [
      {
        type: String,
        trim: true,
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

WeaponSchema.index({
  name: "text",
  nativeName: "text",
  specialFeatures: "text",
  tags: "text",
});

export default models.Weapon || model("Weapon", WeaponSchema);