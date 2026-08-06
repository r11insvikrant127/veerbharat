import { Schema, model, models } from "mongoose";

const WarAnimalSchema = new Schema(
  {
    animalId: {
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
      enum: ["Horse", "Elephant", "Camel", "Dog"],
      index: true,
    },

    breedSpecies: {
      type: String,
      trim: true,
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "Hero",
      required: true,
      index: true,
    },

    kingdomId: {
      type: Schema.Types.ObjectId,
      ref: "Kingdom",
      index: true,
    },

    specialAbilities: [
      {
        type: String,
        trim: true,
      },
    ],

    disguiseDetails: {
      disguise: {
        type: String,
        trim: true,
      },

      purpose: {
        type: String,
        trim: true,
      },
    },

    notableBattles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Battle",
      },
    ],

    armourId: {
      type: Schema.Types.ObjectId,
      ref: "Weapon",
    },

    fate: {
      type: String,
      trim: true,
    },

    memorialId: {
      type: Schema.Types.ObjectId,
      ref: "Memorial",
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

      relatedMemorials: [
        {
          type: Schema.Types.ObjectId,
          ref: "Memorial",
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

WarAnimalSchema.index({
  name: "text",
  breedSpecies: "text",
  specialAbilities: "text",
  tags: "text",
});

export default models.WarAnimal || model("WarAnimal", WarAnimalSchema);