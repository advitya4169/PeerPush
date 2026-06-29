import express from "express";
import { getMe, syncUser } from "../Controllers/userController.js";

const router = express.Router();

router.post("/sync",syncUser);
router.get("/me/:clerkId",getMe);

export default router;