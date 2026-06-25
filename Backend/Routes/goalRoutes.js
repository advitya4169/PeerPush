import express from "express";
import { createGoal, getMyGoals } from "../Controllers/goalController.js";

const router = express.Router();
router.post("/",createGoal);
router.get("/my/:clerkId",getMyGoals)
export default router;