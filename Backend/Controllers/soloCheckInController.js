import SoloCheckIn from "../Models/SoloCheckIn.js";
import Goal from "../Models/Goal.js";
import User from "../Models/User.js";

export const createSoloCheckIn = async (req, res) => {
  console.log("createSoloCheckIn called");
  try {
    const { clerkId, goalId, proofType, content } = req.body;

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const goal = await Goal.findById(goalId);

    if (!goal) {
      return res.status(404).json({
        message: "Mission not found",
      });
    }

    let today = new Date().toISOString().split("T")[0];

    const existingCheckIn = await SoloCheckIn.findOne({
      goalId,
      userId: user._id,
      date: today,
    });

    if (existingCheckIn) {
      return res.status(400).json({
        message: "You've already checked in today.",
      });
    }

    const checkIn = await SoloCheckIn.create({
      goalId,
      userId: user._id,
      proof: {
        type: proofType || "text",
        content,
      },
      date: today,
    });

    // Update streak
     today = new Date();
today.setHours(0, 0, 0, 0);

if (!goal.lastCheckInDate) {
  // First ever check-in
  goal.currentStreak = 1;
} else {
  const last = new Date(goal.lastCheckInDate);
  last.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (today - last) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 1) {
    // Continued streak
    goal.currentStreak += 1;
  } else if (diffDays > 1) {
    // Streak broken
    goal.currentStreak = 1;
  }
  // diffDays === 0 cannot happen because duplicate check-ins are prevented
}

goal.lastCheckInDate = today;

goal.longestStreak = Math.max(
  goal.longestStreak,
  goal.currentStreak
);

// NEW
goal.completedCheckIns += 1;

// Auto-complete mission
if (goal.completedCheckIns >= goal.targetCheckIns) {
  goal.status = "completed";
}

await goal.save();

    const populatedCheckIn = await SoloCheckIn.findById(checkIn._id)
      .populate("userId");

    res.status(201).json({
      message: "Check-in submitted successfully.",
      checkIn: populatedCheckIn,
      goal,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSoloCheckIns = async (req, res) => {
  try {
    const { goalId } = req.params;

    const checkIns = await SoloCheckIn.find({
      goalId,
    })
      .populate("userId")
      .sort({ createdAt: -1 });

    res.status(200).json(checkIns);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};