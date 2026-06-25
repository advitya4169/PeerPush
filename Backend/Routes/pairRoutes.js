import express from "express";
import { getPairById, validatePairStreak,useFreeze } from "../Controllers/pairController.js";

const router = express.Router();
router.get("/:pairId",getPairById);
router.post("/validate/:pairId",validatePairStreak);
router.post("/:pairId/freeze",useFreeze);
export default router;