import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routers/userRouter.js";
import productRouter from "./routers/productRouter.js";
import orderRouter from "./routers/orderRouter.js";
import verifyJWT from "./middleware/auth.js";

//dependency
const app = express();

//mongodb+srv://admin:123@cluster0.ldsnt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
mongoose.connect("mongodb+srv://admin:123@cluster0.ldsnt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(
    ()=>{
        console.log("Connected to the database");
    }
).catch(
    ()=>{
        console.log("Connection failed!");
    }
)

//middleware
app.use(bodyParser.json());
//create a middleware
app.use(verifyJWT);

//routers connection-----------------------
//connect the studentrouter---if a http request comes as /student
//please connect it to the studentRouter
app.use("/api/user",userRouter);
app.use("/api/product",productRouter);
app.use("/api/order",orderRouter);


//add a comment
app.listen(4000,()=>{
    console.log("Server is running on port 4000");
})