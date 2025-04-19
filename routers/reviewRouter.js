import express from "express";
import { getAllReviews, createReview, hideReview, unhideReview } from "../controllers/reviewController.js";
import verifyJWT from "../middleware/auth.js";

const reviewRouter = express.Router();

reviewRouter.get("/", getAllReviews);
reviewRouter.post("/", verifyJWT, createReview);
reviewRouter.put("/:id/hide", verifyJWT, hideReview);
reviewRouter.put("/:id/unhide", verifyJWT, unhideReview);

export default reviewRouter;
