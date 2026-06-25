import express from "express";
import { createCheckIn, getPairCheckIns,reactToCheckIn } from "../Controllers/checkInController.js";

const router = express.Router();
router.post("/",createCheckIn);
router.get("/:pairId",getPairCheckIns);
router.patch("/:checkInId/react",reactToCheckIn);
export default router;