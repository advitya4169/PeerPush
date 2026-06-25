import express from "express";
import { getMe, joinQueue, syncUser } from "../Controllers/userController.js";

const router = express.Router();

router.post("/sync",syncUser);
router.get("/me/:clerkId",getMe);
router.post("/join-queue",joinQueue);
export default router;