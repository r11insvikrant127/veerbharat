import { Schema, model, models } from "mongoose";

const CounterSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },

    sequence: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
  }
);

const Counter = models.Counter || model("Counter", CounterSchema);

export default Counter;