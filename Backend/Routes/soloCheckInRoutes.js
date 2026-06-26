import express from "express";
import {
  createSoloCheckIn,
  getSoloCheckIns,
} from "../Controllers/soloCheckInController.js";

const router = express.Router();

router.post("/", createSoloCheckIn);

router.get("/:goalId", getSoloCheckIns);

export default router;