import Goal from "../Models/Goal.js";
import Pair from "../Models/Pair.js";
import User from "../Models/User.js";

export const findMatch = async (req, res) => {
  try {
    res.status(200).json({
      message: "Matchmaking controller ready",
    });
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

    const goal = await Goal.findById(goalId);
    const existingPartnerMission = await Goal.findOne({
        userId: user._id,
        pairId: { $ne: null },
        status: "active",
      });

      if (
        existingPartnerMission &&
        existingPartnerMission._id.toString() !== goal._id.toString()
      ) {
        return res.status(409).json({
          message:
            "You already have an active partnership. Finish it before starting another.",
        });
      }
    if (!goal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    // Verify mission belongs to current user
    if (goal.userId.toString() !== user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized goal",
      });
    }

    // Prevent duplicate queue entries
    if (goal.mode === "partner" && goal.status === "searching") {
      return res.status(400).json({
        message: "Mission already searching for a partner",
      });
    }

    // Prevent already paired mission
    if (goal.pairId) {
      return res.status(400).json({
        message: "Mission already paired",
      });
    }

    // Put mission into matchmaking
    goal.mode = "partner";
    goal.status = "searching";
    await goal.save();

    // Find another waiting mission
    const waitingGoals = await Goal.find({
      category: goal.category,
      mode: "partner",
      status: "searching",
    }).populate("userId");

    const partnerGoal = waitingGoals.find(
      (g) =>
        g._id.toString() !== goal._id.toString() &&
        g.userId._id.toString() !== user._id.toString()
    );

    // Nobody waiting yet
    if (!partnerGoal) {
      return res.status(200).json({
        message: "Added to queue. Waiting for partner.",
      });
    }

    // Create pair
    const pair = await Pair.create({
      user1Id: user._id,
      user2Id: partnerGoal.userId._id,

      goal1Id: goal._id,
      goal2Id: partnerGoal._id,

      goalCategory: goal.category,
    });

    // Update current mission
    goal.status = "active";
    goal.pairId = pair._id;

    // Update partner mission
    partnerGoal.status = "active";
    partnerGoal.pairId = pair._id;

    await goal.save();
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

export const checkMatchStatus = async (req, res) => {
  try {
    const { goalId } = req.params;

    const goal = await Goal.findById(goalId);

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    res.status(200).json({
      matched: !!goal.pairId,
      pairId: goal.pairId,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const cancelMatchmaking = async (req, res) => {
  try {
    const { goalId } = req.params;

    const goal = await Goal.findById(goalId);

    if (!goal) {
      return res.status(404).json({
        message: "Mission not found",
      });
    }

    if (goal.pairId) {
      return res.status(400).json({
        message: "Mission already paired",
      });
    }

    goal.mode = "solo";
    goal.status = "active";

    await goal.save();

    res.status(200).json({
      message: "Matchmaking cancelled",
      goal,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

