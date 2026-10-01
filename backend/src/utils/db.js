import mongoose from "mongoose";

export const isDatabaseUnavailable = (error) =>
        mongoose.connection.readyState !== 1 &&
        (
        error?.name === "MongooseServerSelectionError" ||
        error?.name === "MongoNotConnectedError" ||
        error?.name?.startsWith("MongoNetwork") ||
        (error?.name === "MongooseError" && error.message.includes("buffering timed out"))
        );

export const requireDatabase = (_req, res, next) => {
        if (mongoose.connection.readyState !== 1) {
                return res.status(503).json({
                        status: "fail",
                        message: "The database is unavailable. Check MongoDB Atlas network access and try again.",
                });
        }

        next();
};

const connectDB = async () => {
        if (!process.env.MONGO_URI) {
                throw new Error("MONGO_URI is missing from the backend environment.");
        }

        await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 10000,
        });
        console.log("MongoDB connected");
};

export default connectDB;