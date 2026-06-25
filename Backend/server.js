import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {clerkMiddleware} from "@clerk/express";
import connectDB from "./db.js";
import userRoutes from "./Routes/userRoutes.js";
import goalRoutes from "./Routes/goalRoutes.js";
import matchmakingRoutes from "./Routes/matchmakingRoutes.js";
import pairRoutes from "./Routes/pairRoutes.js";
import checkInRoutes from "./Routes/checkInRoutes.js";
import http from "http";
import {initSocket} from "./socket.js";
import inngestRoutes from "./Routes/inngestRoutes.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.use("/api/users",userRoutes);
app.use("/api/goals",goalRoutes);
app.use("/api/matchmaking",matchmakingRoutes);
app.use("/api/pairs",pairRoutes);
app.use("/api/checkIns",checkInRoutes);
app.use("/api/inngest",inngestRoutes);
app.get("/",(req,res)=>{
    res.send("PeerPush API Running");
});
const server=http.createServer(app);
initSocket(server);
connectDB().then(
    server.listen(process.env.PORT,()=>{
    console.log("Server running");
})
);

