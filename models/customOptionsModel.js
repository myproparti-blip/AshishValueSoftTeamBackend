import mongoose from "mongoose";

const customOptionsSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ["banks", "cities", "dsas", "engineers"],
      required: true,
      index: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: String,
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);
customOptionsSchema.index({ clientId: 1, type: 1, value: 1 }, { unique: true });
export default mongoose.model("CustomOption", customOptionsSchema);
