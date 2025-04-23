import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import morgan from "morgan";
import logger from './logger.js'; // imported logger

import userRouter from "./routers/userRouter.js";
import productRouter from "./routers/productRouter.js";
import orderRouter from "./routers/orderRouter.js";
import reviewRouter from "./routers/reviewRouter.js";
import dotenv from 'dotenv';
dotenv.config();

import verifyJWT from "./middleware/auth.js";

//dependency
const app = express();

//mongodb+srv://admin:123@cluster0.ldsnt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
mongoose.connect(process.env.MONGO_DB_URL).then(
    ()=> {
        console.log("Connected to the database");
    }
).catch(
    ()=> {
        console.log("Connection failed!");
    }
)

// Middleware: Logging
app.use(morgan("dev")); // logs HTTP requests to console

// Example custom log (this should now use the imported logger)
logger.info("App started");

// Optional: Log errors
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send("Something broke!");
});

// Middleware
app.use(bodyParser.json());
app.use(verifyJWT);

// Routers connection
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/review", reviewRouter);

// A small route to check if the app is alive...
app.get('/health', (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Start server
export default app;
