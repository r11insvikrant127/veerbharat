import mongoose, {
  Schema,
  type Model,
  type Types,
} from "mongoose";

/**
 * Embedded location information
 */
export interface IHistoricalLocation {
  name: string;
  region?: string;
  presentDayLocation?: string;
}

/**
 * Allegiance / political affiliation
 */
export interface IHistoricalAllegiance {
  entity: string;
  role?: string;
}

/**
 * Major event associated with the personality
 */
export interface IHistoricalMajorEvent {
  name: string;
  year?: number;
  date?: Date | string;
  role?: string;
  description?: string;
}

/**
 * Structured biography.
 *
 * Some existing MongoDB records use biography as a plain string,
 * while HP0001 uses a structured object. Both formats are supported.
 */
export interface IHistoricalBiography {
  shortDescription?: string;
  earlyLife?: string;
  education?: string;
  family?: string;
  militaryCareer?: string;
  politicalCareer?: string;
  administrativeCareer?: string;
  campaignAgainstShivaji?: string;
  siegeOfPurandar?: string;
  treatyOfPurandar?: string;
  majorAchievements?: string;
  historicalSignificance?: string;
  laterLife?: string;
}

/**
 * Source / reference information
 */
export interface IHistoricalSource {
  title?: string;
  author?: string;
  url?: string;
  publication?: string;
  year?: number;
  accessedAt?: Date;
  sourceId?: string;
}

/**
 * Verification metadata
 */
export interface IHistoricalVerification {
  isVerified?: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  verificationNotes?: string;
}

/**
 * Main Historical Personality interface
 */
export interface IHistoricalPersonality {
  /**
   * Unique VeerBharat personality ID
   * Example: HP0001
   */
  historicalPersonalityId: string;

  /**
   * Primary name
   */
  name: string;

  /**
   * Native / original name
   */
  nativeName?: string;

  /**
   * Other historically used names
   */
  alternativeNames?: string[];

  /**
   * Primary title
   */
  title?: string;

  /**
   * Gender
   */
  gender?: string;

  /**
   * Broad classification
   * Example: Ruler, Naval Officer, Colonial Administrator
   */
  category?: string;

  /**
   * Roles held during life
   */
  roles?: string[];

  /**
   * Birth information
   */
  birthDate?: Date;
  birthDateAccuracy?: string;
  birthplace?: IHistoricalLocation;

  /**
   * Death information
   */
  deathDate?: Date;
  deathDateAccuracy?: string;
  deathPlace?: IHistoricalLocation;

  /**
   * Dynastic / political background
   */
  dynasty?: string;
  kingdom?: string;

  /**
   * Political / military allegiances
   */
  allegiance?: IHistoricalAllegiance[];

  /**
   * Things the person is principally remembered for
   */
  knownFor?: string[];

  /**
   * Short profile description
   */
  shortDescription?: string;

  /**
   * Detailed biography.
   *
   * Kept flexible because existing MongoDB records contain
   * both string and structured-object biographies.
   */
  biography?: string | IHistoricalBiography;

  /**
   * Major historical events involving the personality
   */
  majorEvents?: IHistoricalMajorEvent[];

  /**
   * Long-term historical legacy
   */
  legacy?: string;

  /**
   * Why this person belongs in Historical Personalities
   * rather than another entity category.
   */
  classificationReason?: string;

  /**
   * Search / discovery tags
   */
  tags?: string[];

  /**
   * Additional search terms.
   *
   * Useful for names, titles, places, battles, dynasties, etc.
   */
  searchFields?: string[];

  /**
   * Historical period
   *
   * Example:
   * "17th Century"
   * "First Carnatic War"
   */
  period?: string;

  /**
   * Historical era
   *
   * Example:
   * "Mughal Period"
   * "Colonial Period"
   */
  era?: string;

  /**
   * Additional achievements
   */
  achievements?: string[];

  /**
   * Historical controversies / differing interpretations
   */
  controversies?: string[];

  /**
   * Additional notes for researchers / editors
   */
  notes?: string;

  /**
   * External references / bibliography
   */
  sources?: IHistoricalSource[];

  /**
   * Verification information
   */
  verification?: IHistoricalVerification;

  /**
   * Linked images
   */
  imageIds?: Types.ObjectId[];

  /**
   * Publication status
   */
  status?: string;

  /**
   * Audit timestamps
   */
  createdAt?: Date;
  updatedAt?: Date;
}


/* -------------------------------------------------------------------------- */
/* Embedded Schemas                                                           */
/* -------------------------------------------------------------------------- */

const HistoricalLocationSchema =
  new Schema<IHistoricalLocation>(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      region: {
        type: String,
        trim: true,
      },

      presentDayLocation: {
        type: String,
        trim: true,
      },
    },
    {
      _id: false,
    }
  );


const HistoricalAllegianceSchema =
  new Schema<IHistoricalAllegiance>(
    {
      entity: {
        type: String,
        required: true,
        trim: true,
      },

      role: {
        type: String,
        trim: true,
      },
    },
    {
      _id: false,
    }
  );


const HistoricalMajorEventSchema =
  new Schema<IHistoricalMajorEvent>(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      year: {
        type: Number,
      },

      date: {
        type: Schema.Types.Mixed,
      },

      role: {
        type: String,
        trim: true,
      },

      description: {
        type: String,
        trim: true,
      },
    },
    {
      _id: false,
    }
  );


const HistoricalBiographySchema =
  new Schema<IHistoricalBiography>(
    {
      shortDescription: {
        type: String,
        trim: true,
      },

      earlyLife: {
        type: String,
      },

      education: {
        type: String,
      },

      family: {
        type: String,
      },

      militaryCareer: {
        type: String,
      },

      politicalCareer: {
        type: String,
      },

      administrativeCareer: {
        type: String,
      },

      campaignAgainstShivaji: {
        type: String,
      },

      siegeOfPurandar: {
        type: String,
      },

      treatyOfPurandar: {
        type: String,
      },

      majorAchievements: {
        type: String,
      },

      historicalSignificance: {
        type: String,
      },

      laterLife: {
        type: String,
      },
    },
    {
      _id: false,
    }
  );


const HistoricalSourceSchema =
  new Schema<IHistoricalSource>(
    {
      title: {
        type: String,
        trim: true,
      },

      author: {
        type: String,
        trim: true,
      },

      url: {
        type: String,
        trim: true,
      },

      publication: {
        type: String,
        trim: true,
      },

      year: {
        type: Number,
      },

      accessedAt: {
        type: Date,
      },

      sourceId: {
        type: String,
        trim: true,
      },
    },
    {
      _id: false,
    }
  );


const HistoricalVerificationSchema =
  new Schema<IHistoricalVerification>(
    {
      isVerified: {
        type: Boolean,
        default: false,
      },

      verifiedBy: {
        type: String,
        trim: true,
      },

      verifiedAt: {
        type: Date,
      },

      verificationNotes: {
        type: String,
      },
    },
    {
      _id: false,
    }
  );


/* -------------------------------------------------------------------------- */
/* Main Schema                                                                */
/* -------------------------------------------------------------------------- */

const HistoricalPersonalitySchema =
  new Schema<IHistoricalPersonality>(
    {
      /* ----------------------------- Identity ----------------------------- */

      historicalPersonalityId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
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

      alternativeNames: {
        type: [String],
        default: [],
      },


      /* ------------------------------ Titles ------------------------------ */

      title: {
        type: String,
        trim: true,
      },

      gender: {
        type: String,
        trim: true,
      },

      category: {
        type: String,
        trim: true,
        index: true,
      },

      roles: {
        type: [String],
        default: [],
      },


      /* ---------------------------- Life Dates ---------------------------- */

      birthDate: {
        type: Date,
      },

      birthDateAccuracy: {
        type: String,
        trim: true,
      },

      deathDate: {
        type: Date,
      },

      deathDateAccuracy: {
        type: String,
        trim: true,
      },


      /* ----------------------------- Locations ---------------------------- */

      birthplace: {
        type: HistoricalLocationSchema,
      },

      deathPlace: {
        type: HistoricalLocationSchema,
      },


      /* ----------------------- Political Background ---------------------- */

      dynasty: {
        type: String,
        trim: true,
        index: true,
      },

      kingdom: {
        type: String,
        trim: true,
        index: true,
      },

      allegiance: {
        type: [HistoricalAllegianceSchema],
        default: [],
      },


      /* --------------------------- Significance --------------------------- */

      knownFor: {
        type: [String],
        default: [],
      },

      shortDescription: {
        type: String,
        trim: true,
      },

      /**
       * Mixed is intentional.
       *
       * Existing records:
       *
       * HP0001 -> structured biography object
       * HP0002-HP0005 -> string biography
       *
       * Therefore changing this to String would break HP0001.
       */
      biography: {
        type: Schema.Types.Mixed,
      },


      majorEvents: {
        type: [HistoricalMajorEventSchema],
        default: [],
      },

      legacy: {
        type: String,
      },

      classificationReason: {
        type: String,
      },


      /* ------------------------- Historical Context ---------------------- */

      period: {
        type: String,
        trim: true,
        index: true,
      },

      era: {
        type: String,
        trim: true,
        index: true,
      },

      achievements: {
        type: [String],
        default: [],
      },

      controversies: {
        type: [String],
        default: [],
      },


      /* ----------------------------- Search ------------------------------- */

      tags: {
        type: [String],
        default: [],
        index: true,
      },

      searchFields: {
        type: [String],
        default: [],
      },


      /* --------------------------- Extra Research ------------------------- */

      notes: {
        type: String,
      },

      sources: {
        type: [HistoricalSourceSchema],
        default: [],
      },


      /* ---------------------------- Verification -------------------------- */

      verification: {
        type: HistoricalVerificationSchema,
      },


      /* ------------------------------- Media ------------------------------ */

      imageIds: [
        {
          type: Schema.Types.ObjectId,
          ref: "Image",
        },
      ],


      /* ------------------------------ Status ------------------------------ */

      status: {
        type: String,
        default: "published",
        trim: true,
        index: true,
      },
    },

    {
      timestamps: true,

      // IMPORTANT:
      // This must match the existing MongoDB collection.
      collection: "historicalpersonalities",
    }
  );


/* -------------------------------------------------------------------------- */
/* Indexes                                                                    */
/* -------------------------------------------------------------------------- */

HistoricalPersonalitySchema.index({
  name: "text",
  nativeName: "text",
  alternativeNames: "text",
  shortDescription: "text",
  tags: "text",
  searchFields: "text",
  dynasty: "text",
  kingdom: "text",
  category: "text",
});


/* -------------------------------------------------------------------------- */
/* Model                                                                      */
/* -------------------------------------------------------------------------- */

const HistoricalPersonality: Model<IHistoricalPersonality> =
  mongoose.models.HistoricalPersonality ||
  mongoose.model<IHistoricalPersonality>(
    "HistoricalPersonality",
    HistoricalPersonalitySchema
  );

export default HistoricalPersonality;