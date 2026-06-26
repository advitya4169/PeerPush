import express from "express";
import {
  createGoal,
  getMyGoals,
  getGoalById,
} from "../Controllers/goalController.js";
const router = express.Router();
router.post("/",createGoal);
router.get("/my/:clerkId",getMyGoals)
router.get("/:id", getGoalById);
export default router;