import mongoose from "mongoose";

const { Schema } = mongoose;

const enrollmentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "session",
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["PAID", "SPONSORED"],
      default: "PAID",
    },

    amount: {
      type: Number,
      default: 100,
    },

    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("enrollment", enrollmentSchema);