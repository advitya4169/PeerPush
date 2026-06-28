import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // <-- typo fixed
    },

    category: {
      type: String,
      enum: [
        "Coding",
        "Fitness",
        "Reading",
        "Language",
        "Project",
        "Other",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
    dailyTarget: {
      type: String,
      required: true,
      trim: true,
},
    mode: {
      type: String,
      enum: ["solo", "partner"],
      default: "solo",
    },

    status: {
      type: String,
      enum: ["active", "searching", "completed", "abandoned"],
      default: "active",
    },

    currentStreak: {
      type: Number,
      default: 0,
    },

    longestStreak: {
      type: Number,
      default: 0,
    },

    pairId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pair",
      default: null,
    },

    lastCheckInDate: {
      type: Date,
      default: null,
    },
    
    targetCheckIns: {
      type: Number,
      required: true,
      min: 1,
    },

    completedCheckIns: {
      type: Number,
      default: 0,
    },
  },
  
  { timestamps: true }
);

export default mongoose.model("Goal", goalSchema);