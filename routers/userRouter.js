import express from "express";
import { getAllUsers, loginUser, saveUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/",getAllUsers);
userRouter.post("/",saveUser);
userRouter.post("/login",loginUser)

export default userRouter;
