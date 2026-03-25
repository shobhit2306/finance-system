import mongoose from "mongoose";

const { Schema } = mongoose;

const sessionSchema = new Schema(
  {
    title: { type: String, required: true },

    adminId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    startDate: { type: Date, required: true },

    endDate: { type: Date, required: true },

    status: {
      type: String,
      enum: ["UPCOMING", "ACTIVE", "EXPIRED"],
      default: "UPCOMING",
    },

    isActive: {
      type: Boolean,
      default: false,
    },

    price: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("session", sessionSchema);