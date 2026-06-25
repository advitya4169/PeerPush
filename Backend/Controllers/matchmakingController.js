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