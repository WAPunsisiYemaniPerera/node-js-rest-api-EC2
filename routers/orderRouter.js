import express from 'express';
import { createOrder , getOrders, updateOrderStatus } from '../controllers/orderController.js';
import verifyJWT from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.post("/",verifyJWT, createOrder);
orderRouter.get("/",verifyJWT, getOrders);
orderRouter.put("/:id/status", verifyJWT, updateOrderStatus);

export default orderRouter;
