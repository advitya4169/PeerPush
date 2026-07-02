import Pair from "../Models/Pair.js";
import CheckIn from "../Models/CheckIn.js";
import User from "../Models/User.js";

export const getPairById = async (req, res) => {
  try {
    const { pairId } = req.params;

    const pair = await Pair.findById(pairId)
      .populate("user1Id")
      .populate("user2Id")
      .populate("goal1Id")
      .populate("goal2Id");

    if (!pair) {
      return res.status(404).json({
        message: "Pair not found",
      });
    }

    const today = new Date().toISOString().split("T")[0];

    const todayCheckIns = await CheckIn.find({
      pairId,
      date: today,
    });

    const user1CheckedIn = todayCheckIns.some(
      (checkIn) =>
        checkIn.userId.toString() === pair.user1Id._id.toString()
    );

    const user2CheckedIn = todayCheckIns.some(
      (checkIn) =>
        checkIn.userId.toString() === pair.user2Id._id.toString()
    );

    res.status(200).json({
      ...pair.toObject(),

      todayStatus: {
        user1: user1CheckedIn,
        user2: user2CheckedIn,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const validatePairStreak = async (req, res) => {
  try {
    const { pairId } = req.params;

    const pair = await Pair.findById(pairId);

    if (!pair) {
      return res.status(404).json({
        message: "Pair not found",
      });
    }

    const today = new Date()
      .toISOString()
      .split("T")[0];

    // Prevent multiple validations on same day
    if (
      pair.lastBothCheckedIn &&
      pair.lastBothCheckedIn
        .toISOString()
        .split("T")[0] === today
    ) {
      return res.status(200).json({
        success: true,
        message: "Already validated today",
        streak: pair.streakCount,
        longestStreak: pair.longestStreak,
      });
    }

    const [user1CheckIn, user2CheckIn] =
      await Promise.all([
        CheckIn.findOne({
          pairId,
          userId: pair.user1Id,
          date: today,
        }),

        CheckIn.findOne({
          pairId,
          userId: pair.user2Id,
          date: today,
        }),
      ]);

    // Both checked in
    if (user1CheckIn && user2CheckIn) {
      pair.streakCount += 1;

      pair.longestStreak = Math.max(
        pair.longestStreak,
        pair.streakCount
      );

      pair.lastBothCheckedIn = new Date();

      await pair.save();

      return res.status(200).json({
        success: true,
        message: "Streak increased successfully",
        streak: pair.streakCount,
        longestStreak: pair.longestStreak,
      });
    }

    // One or both missed
    pair.streakCount = 0;

    await pair.save();

    return res.status(200).json({
      success: false,
      message: "Streak broken",
      streak: 0,
      longestStreak: pair.longestStreak,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getTodayStatus = async (req, res) => {
  try {
    const { pairId } = req.params;

    const today = new Date().toISOString().split("T")[0];

    const pair = await Pair.findById(pairId);

    if (!pair) {
      return res.status(404).json({
        message: "Pair not found",
      });
    }

    const [user1, user2] = await Promise.all([
      CheckIn.exists({
        pairId,
        userId: pair.user1Id,
        date: today,
      }),

      CheckIn.exists({
        pairId,
        userId: pair.user2Id,
        date: today,
      }),
    ]);

    res.json({
      user1: !!user1,
      user2: !!user2,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};