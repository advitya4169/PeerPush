import express from "express";
import {
  getPairById,
  getTodayStatus,
  validatePairStreak,
  abandonPair,
} from "../Controllers/pairController.js";
const router = express.Router();
router.get("/:pairId",getPairById);
router.post("/validate/:pairId",validatePairStreak);
router.get("/:pairId/today", getTodayStatus);
router.patch("/:pairId/abandon", abandonPair);
export default router;