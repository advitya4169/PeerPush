import express from "express";
import { findMatch } from "../Controllers/matchmakingController.js";

const router = express.Router();

router.post("/find-match",findMatch);
export default router;