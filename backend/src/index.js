import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieparser from "cookie-parser";
import mongoose from "mongoose";
import {router} from "./routes/userRoutes.js"
import { propertyRouter } from "./routes/propertyRouter.js";
import { bookingRouter } from "./routes/bookingRouter.js";
import { tripRouter } from "./routes/tripRouter.js";

import connectDB from "./utils/db.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}));

//express.json
app.use(express.json({limit:"100mb"}))

//urlencoded
app.use(express.urlencoded({limit:"100mb", extended:true}))

//cookieparser
app.use(cookieparser())

app.use(cors({
    origin:process.env.ORIGIN_ACCESS_URL,
    credentials:true
}))

const port = Number(process.env.PORT) || 8080;

//one test route
app.get("/",(req,res)=>{
    res.send("HomelyHub server is running")

})

app.get("/health", (_req, res) => {
    const databaseConnected = mongoose.connection.readyState === 1;
    res.status(databaseConnected ? 200 : 503).json({
        status: databaseConnected ? "healthy" : "degraded",
        server: "running",
        database: databaseConnected ? "connected" : "disconnected",
    });
});

app.use("/api/v1/rent/user",router)
app.use("/api/v1/rent/listing",propertyRouter)
app.use("/api/v1/rent/user/booking",bookingRouter)
app.use("/api/v1/rent/trip/", tripRouter)


const server = app.listen(port, () => {
    console.log(`App is running on port no: ${port}`);
});

let retryDelay = 5000;
const connectWithRetry = async () => {
    try {
        await connectDB();
        retryDelay = 5000;
    } catch (error) {
        console.error("MongoDB connection failed; the API is available in degraded mode:", error.message);

        const servers = error.reason?.servers?.values?.();
        if (servers) {
            for (const server of servers) {
                if (server.error?.message) {
                    console.error("MongoDB connection detail:", server.error.message);
                }
            }
        }

        const retryTimer = setTimeout(connectWithRetry, retryDelay);
        retryTimer.unref();
        retryDelay = Math.min(retryDelay * 2, 60000);
    }
};

void connectWithRetry();

const shutdown = () => {
    server.close(() => {
        mongoose.disconnect().finally(() => process.exit(0));
    });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);