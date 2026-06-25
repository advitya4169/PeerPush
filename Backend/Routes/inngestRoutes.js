import express from "express";
import { inngest } from "../Inngest/client.js";
import {serve} from "inngest/express";
import { resetMonthlyFreezes, validateDailyStreaks } from "../Inngest/functions.js";
const router = express.Router();

router.use("/",serve({
    client:inngest,
    functions:[
        validateDailyStreaks,resetMonthlyFreezes,
    ],
}));

export default router;