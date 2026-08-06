import { Schema, model, models } from "mongoose";

const BattleSchema = new Schema(
  {
    battleId: {
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

    battleDate: {
      type: Date,
      default: null,
    },

    battleDateAccuracy: {
      type: String,
      enum: [
        "Exact",
        "Approximate",
        "Unknown",
      ],
      default: "Unknown",
    },

    locationId: {
      type: Schema.Types.ObjectId,
      ref: "Place",
      required: true,
      index: true,
    },

    historicalPeriodId: {
      type: Schema.Types.ObjectId,
      ref: "HistoricalPeriod",
      index: true,
    },

    kingdomIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Kingdom",
        required: true,
      },
    ],

    commanderIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Hero",
        required: true,
      },
    ],

    opposingCommanderIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "MilitaryCommander",
      },
    ],

    victorId: {
      type: Schema.Types.ObjectId,
      refPath: "victorModel",
    },

    victorModel: {
      type: String,
      enum: ["Hero", "Kingdom"],
    },

    casualties: {
      type: Number,
      min: 0,
    },

    armySizes: {
      type: Map,
      of: Number,
    },

    weaponsUsed: [
      {
        type: Schema.Types.ObjectId,
        ref: "Weapon",
      },
    ],

    warAnimalIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "WarAnimal",
      },
    ],

    strategyId: {
      type: Schema.Types.ObjectId,
      ref: "WarStrategy",
    },

    keyEvents: [
      {
        type: String,
        trim: true,
      },
    ],

    significance: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    aftermath: {
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

      relatedKingdoms: [
        {
          type: Schema.Types.ObjectId,
          ref: "Kingdom",
        },
      ],

      relatedWeapons: [
        {
          type: Schema.Types.ObjectId,
          ref: "Weapon",
        },
      ],

      relatedPlaces: [
        {
          type: Schema.Types.ObjectId,
          ref: "Place",
        },
      ],

      relatedEvents: [
        {
          type: Schema.Types.ObjectId,
          ref: "Event",
        },
      ],

      relatedBooks: [
        {
          type: Schema.Types.ObjectId,
          ref: "Book",
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

BattleSchema.index({
  name: "text",
  nativeName: "text",
  alternativeNames: "text",
  keyEvents: "text",
  tags: "text",
});

export default models.Battle || model("Battle", BattleSchema);