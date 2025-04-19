import express from "express";
import { getAllUsers, loginUser, saveUser, blockUser, addAddress, updateAddress, deleteAddress } from "../controllers/userController.js";
import verifyJWT from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.get("/",getAllUsers);
userRouter.post("/",verifyJWT, saveUser);
userRouter.post("/login",loginUser);
userRouter.put("/:id/block", verifyJWT, blockUser);

// Address routes
userRouter.post("/address", verifyJWT, addAddress);
userRouter.put("/address", verifyJWT, updateAddress);
userRouter.delete("/address", verifyJWT, deleteAddress);

export default userRouter;
