import express from "express";
import {
  createGoal,
  getMyGoals,
  getGoalById,
  updateMissionStatus,
  getMissionHistory,
} from "../Controllers/goalController.js";
const router = express.Router();
router.post("/",createGoal);
router.get("/my/:clerkId",getMyGoals);
router.get("/history/:clerkId", getMissionHistory);
router.get("/:id", getGoalById);
router.patch("/:id/status", updateMissionStatus);
export default router;