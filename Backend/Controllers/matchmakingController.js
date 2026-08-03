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
    const requiresAcceptance =
    goal.targetCheckIns !== partnerGoal.targetCheckIns;

const currentIsSmaller =
  goal.targetCheckIns < partnerGoal.targetCheckIns;

const pair = await Pair.create({
  user1Id: user._id,
  user2Id: partnerGoal.userId._id,

  goal1Id: goal._id,
  goal2Id: partnerGoal._id,

  goalCategory: goal.category,

  requiresAcceptance,
  acceptedBySmallerTarget: !requiresAcceptance,
});

    // Link both goals to the pair
goal.pairId = pair._id;
partnerGoal.pairId = pair._id;

// Same target -> activate immediately
if (!requiresAcceptance) {
  goal.status = "active";
  partnerGoal.status = "active";

  await goal.save();
  await partnerGoal.save();

  return res.status(200).json({
    message: "Match Found!",
    pair,
  });
}

// Different targets -> wait for smaller target user's confirmation
goal.status = "searching";
partnerGoal.status = "searching";

await goal.save();
await partnerGoal.save();

return res.status(200).json({
  requiresAcceptance: currentIsSmaller,
  waitingForPartner: !currentIsSmaller,
  yourTarget: goal.targetCheckIns,
  partnerTarget: partnerGoal.targetCheckIns,
  pairId: pair._id,
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

    if (!goal.pairId) {
      return res.status(200).json({
        matched: false,
      });
    }

    const pair = await Pair.findById(goal.pairId)
      .populate("goal1Id")
      .populate("goal2Id");

    if (!pair) {
      return res.status(200).json({
        matched: false,
      });
    }

    const currentGoal =
      pair.goal1Id._id.toString() === goalId
        ? pair.goal1Id
        : pair.goal2Id;

    const partnerGoal =
      pair.goal1Id._id.toString() === goalId
        ? pair.goal2Id
        : pair.goal1Id;

    const currentIsSmaller =
      currentGoal.targetCheckIns < partnerGoal.targetCheckIns;

    // Acceptance finished → both users can enter the pair dashboard
if (!pair.requiresAcceptance) {
  return res.status(200).json({
    matched: true,
    active: true,
    pairId: pair._id,
  });
}

return res.status(200).json({
  matched: true,
  active: false,
  pairId: pair._id,
  requiresAcceptance: currentIsSmaller,
  waitingForPartner: !currentIsSmaller,
  yourTarget: currentGoal.targetCheckIns,
  partnerTarget: partnerGoal.targetCheckIns,
});

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const acceptChallenge = async (req, res) => {
  try {
    const { pairId } = req.params;

    const pair = await Pair.findById(pairId);

    if (!pair) {
      return res.status(404).json({
        message: "Pair not found",
      });
    }

    pair.requiresAcceptance = false;
    pair.acceptedBySmallerTarget = true;

    await pair.save();

    const goal1 = await Goal.findById(pair.goal1Id);
    const goal2 = await Goal.findById(pair.goal2Id);

    goal1.status = "active";
    goal2.status = "active";

    await goal1.save();
    await goal2.save();

    res.status(200).json({
      message: "Challenge accepted.",
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

    // Existing solo mission -> restore it
    if (
      goal.lastCheckInDate ||
      goal.completedCheckIns > 0 ||
      goal.currentStreak > 0
    ) {
      goal.mode = "solo";
      goal.status = "active";

      await goal.save();

      return res.status(200).json({
        message: "Returned to solo mission.",
        goal,
      });
    }

    // Fresh partner mission -> delete it
    await Goal.findByIdAndDelete(goalId);

    return res.status(200).json({
      message: "Matchmaking cancelled and mission deleted.",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

