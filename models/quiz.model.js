import mongoose from "mongoose";

const { Schema } = mongoose;

const quizAttemptSchema = new Schema(
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
    date: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

quizAttemptSchema.index({ userId: 1, sessionId: 1, date: 1 }, { unique: true });

export default mongoose.model("quizAttempt", quizAttemptSchema);