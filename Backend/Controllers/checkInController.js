import CheckIn from "../Models/CheckIn.js";
import Pair from "../Models/Pair.js";
import User from "../Models/User.js";
import { getIO } from "../socket.js";

export const createCheckIn = async (req, res) => {
  try {
    const io = getIO();
    const { clerkId, pairId, content, proofType} = req.body;

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const today = new Date()
      .toISOString()
      .split("T")[0];

    const existingCheckIn =
      await CheckIn.findOne({
        pairId,
        userId: user._id,
        date: today,
      });

    if (existingCheckIn) {
      return res.status(400).json({
        message:
          "You have already checked in today",
      });
    }

    const checkIn =
      await CheckIn.create({
        pairId,
        userId: user._id,
        proof: {
          type: proofType||"text",
          content,
        },
        date: today,
      });

    // ==========================
    // AUTO STREAK LOGIC
    // ==========================

    const pair =
      await Pair.findById(pairId);

    const todaysCheckIns =
      await CheckIn.countDocuments({
        pairId,
        date: today,
      });

    if (todaysCheckIns === 2) {
      const alreadyValidated =
        pair.lastBothCheckedIn &&
        pair.lastBothCheckedIn
          .toISOString()
          .split("T")[0] === today;

      if (!alreadyValidated) {
        pair.streakCount += 1;

        pair.longestStreak = Math.max(
          pair.longestStreak,
          pair.streakCount
        );

        pair.lastBothCheckedIn =
          new Date();

        await pair.save();
        io.to(pairId).emit("streak-updated", {
        streakCount: pair.streakCount,
        longestStreak: pair.longestStreak,
        lastBothCheckedIn: pair.lastBothCheckedIn,
      });

        console.log(
          `Streak increased to ${pair.streakCount}`
        );
      }
    }

    // ==========================
    // SOCKET.IO
    // ==========================

    const populatedCheckIn =
      await CheckIn.findById(
        checkIn._id
      ).populate("userId");

    console.log("EMITTING CHECKIN");
    io.to(pairId).emit(
      "new-checkin",
      populatedCheckIn
    );
    console.log(populatedCheckIn);
    res.status(201).json({
      message:
        "Check-in submitted successfully",
      checkIn: populatedCheckIn,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getPairCheckIns = async (req,res) => {
  try {
    const { pairId } = req.params;

    const checkIns =
      await CheckIn.find({
        pairId,
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

export const reactToCheckIn = async (req,res) => {
  try {
    const { checkInId } = req.params;

    const { reaction } = req.body;

    if (
      !["👍", "🔥", "💪"].includes(
        reaction
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid reaction",
      });
    }

    const checkIn =
      await CheckIn.findById(
        checkInId
      ).populate("userId");

    if (!checkIn) {
      return res.status(404).json({
        message:
          "Check-in not found",
      });
    }

    checkIn.partnerReaction =
      reaction;

    await checkIn.save();

    const io = getIO();

    io.to(
      checkIn.pairId.toString()
    ).emit(
      "reaction-updated",
      {
        checkInId:
          checkIn._id,
        reaction,
      }
    );

    res.status(200).json(
      checkIn
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};