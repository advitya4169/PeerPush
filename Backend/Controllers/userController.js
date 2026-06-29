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

