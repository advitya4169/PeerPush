import express from "express";
import { getPairById, getTodayStatus, validatePairStreak } from "../Controllers/pairController.js";

const router = express.Router();
router.get("/:pairId",getPairById);
router.post("/validate/:pairId",validatePairStreak);
router.get("/:pairId/today", getTodayStatus);
export default router;