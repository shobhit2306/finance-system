import mongoose from "mongoose";

const { Schema } = mongoose;

const videoProgressSchema = new Schema(
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
      type: String, // YYYY-MM-DD
      required: true,
    },
    watched: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

videoProgressSchema.index({ userId: 1, sessionId: 1, date: 1 }, { unique: true });

export default mongoose.model("videoProgress", videoProgressSchema);