import mongoose, {
  Schema,
  type Model,
  type Types,
} from "mongoose";

export interface IHistoricalPersonality {
  historicalPersonalityId: string;

  name: string;

  nativeName?: string;

  title?: string;

  gender?: string;

  shortDescription?: string;

  biography?: string;

  birthDate?: Date;

  deathDate?: Date;

  status?: string;

  imageIds?: Types.ObjectId[];

  createdAt?: Date;

  updatedAt?: Date;
}

const HistoricalPersonalitySchema =
  new Schema<IHistoricalPersonality>(
    {
      historicalPersonalityId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      nativeName: {
        type: String,
        trim: true,
      },

      title: {
        type: String,
        trim: true,
      },

      gender: {
        type: String,
        trim: true,
      },

      shortDescription: {
        type: String,
        trim: true,
      },

      biography: {
        type: String,
      },

      birthDate: {
        type: Date,
      },

      deathDate: {
        type: Date,
      },

      status: {
        type: String,
        default: "published",
      },

      imageIds: [
        {
          type: Schema.Types.ObjectId,
          ref: "Image",
        },
      ],
    },
    {
      timestamps: true,

      // IMPORTANT:
      // This must match your actual MongoDB collection name.
      collection: "historicalpersonalities",
    }
  );

const HistoricalPersonality: Model<IHistoricalPersonality> =
  mongoose.models.HistoricalPersonality ||
  mongoose.model<IHistoricalPersonality>(
    "HistoricalPersonality",
    HistoricalPersonalitySchema
  );

export default HistoricalPersonality;