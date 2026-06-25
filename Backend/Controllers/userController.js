import User from "../Models/User.js";
import Goal from "../Models/Goal.js";
import Pair from "../Models/Pair.js";

export const syncUser = async (req, res) => {
  try {
    const { clerkId, username, email, avatar, timezone } = req.body;

    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({
        clerkId,
        username,
        email,
        avatar,
        timezone,
      });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const { clerkId } = req.params;

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const joinQueue = async (req, res) => {
  try {
    const { clerkId, goalId } = req.body;

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Prevent already paired users from joining queue
    if (user.currentPairId) {
      return res.status(400).json({
        message: "User already paired",
      });
    }

    const goal = await Goal.findById(goalId);

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    // Verify goal belongs to user
    if (goal.userId.toString() !== user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized goal",
      });
    }

    user.isInQueue = true;
    await user.save();

    const waitingGoals = await Goal.find({
      category: goal.category,
      status: "queued",
    }).populate("userId");

    const partnerGoal = waitingGoals.find(
      (g) =>
        g.userId._id.toString() !== user._id.toString() && //prevents matching from themselves
        g.userId.isInQueue &&
        !g.userId.currentPairId
    );

    // No partner found
    if (!partnerGoal) {
      return res.status(200).json({
        message: "Added to queue. Waiting for partner.",
      });
    }

    // Create pair
    const pair = await Pair.create({
      user1Id: user._id,
      user2Id: partnerGoal.userId._id,
      goalCategory: goal.category,
    });

    // Update current user
    user.currentPairId = pair._id;
    user.isInQueue = false;
    await user.save();

    // Update partner user
    partnerGoal.userId.currentPairId = pair._id;
    partnerGoal.userId.isInQueue = false;
    await partnerGoal.userId.save();

    // Update both goals
    goal.status = "paired";
    await goal.save();

    partnerGoal.status = "paired";
    await partnerGoal.save();

    res.status(200).json({
      message: "Match Found!",
      pair,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};