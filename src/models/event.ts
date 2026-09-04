import { Schema, model, models } from "mongoose";

const EventSchema = new Schema(
  {
    eventId: {
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

    eventDate: {
      type: Date,
      default: null,
      index: true,
    },

    eventDateAccuracy: {
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
      index: true,
    },

    heroIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Hero",
      },
    ],

    historicalPersonalityIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "HistoricalPersonality",
      },
    ],

    historicalPeriodId: {
      type: Schema.Types.ObjectId,
      ref: "HistoricalPeriod",
      index: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "Birth",
        "Death",
        "Martyrdom",
        "Coronation",
        "Battle",
        "War",
        "Rebellion",
        "Uprising",
        "Massacre",
        "Genocide",
        "Victory",
        "Defeat",
        "Treaty",
        "Proclamation",
        "Declaration",
        "Arrival",
        "Expedition",
        "Reform",
        "Movement",
        "Protest",
        "Revolution",
        "Establishment",
        "Independence",
        "Annexation",
        "Siege",
        "Hiding",
        "Prophecy",
        "Other",
      ],
      index: true,
    },

    isOnThisDayEligible: {
      type: Boolean,
      required: true,
      default: false,
      index: true,
    },

    isPersonalMilestone: {
      type: Boolean,
      required: true,
      default: false,
      index: true,
    },
    
    linkedEventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      default: null,
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
    
    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },

    details: {
      type: String,
      trim: true,
      default: "",
    },

    significance: {
      type: String,
      trim: true,
    },

    imageIds: [
      {
        imageId: {
          type: Schema.Types.ObjectId,
          ref: "Image",
          required: true,
        },

        relatedSection: {
          type: String,
          trim: true,
          default: null,
        },
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

      relatedPlaces: [
        {
          type: Schema.Types.ObjectId,
          ref: "Place",
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

      relatedBooks: [
        {
          type: Schema.Types.ObjectId,
          ref: "Book",
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

EventSchema.index({
  name: "text",
  nativeName: "text",
  shortDescription: "text",
  description: "text",
  details: "text",
  significance: "text",
  tags: "text",
});

export default models.Event || model("Event", EventSchema);