import express from "express";
import { joinQueue, findMatch, checkMatchStatus, cancelMatchmaking } from "../Controllers/matchmakingController.js";

const router = express.Router();

router.post("/join", joinQueue);
router.get("/find", findMatch);
router.get("/status/:goalId", checkMatchStatus);
router.patch("/cancel/:goalId", cancelMatchmaking);
export default router;