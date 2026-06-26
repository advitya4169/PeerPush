import mongoose from "mongoose";

const soloCheckInSchema = new mongoose.Schema(
  {
    goalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    proof: {
      type: {
        type: String,
        enum: ["text", "link", "image"],
        default: "text",
      },

      content: {
        type: String,
        required: true,
      },
    },

    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SoloCheckIn", soloCheckInSchema);