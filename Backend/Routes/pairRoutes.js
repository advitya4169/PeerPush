import express from "express";
import { getPairById, validatePairStreak } from "../Controllers/pairController.js";

const router = express.Router();
router.get("/:pairId",getPairById);
router.post("/validate/:pairId",validatePairStreak);

export default router;