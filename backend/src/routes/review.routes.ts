import express from "express";
import { ReviewController } from "../controllers/review.controller";

const reviewsRouter = express.Router();
const reviewController = new ReviewController();

reviewsRouter.route("/update").put((req, res) => {
  reviewController.updateReview(req, res);
});

reviewsRouter.route("/delete/:id").delete((req, res) => {
  reviewController.deleteReview(req, res);
});

reviewsRouter.get("/all/:agency/:personalized", (req, res) => {
  reviewController.getAllReviews(req, res);
});

reviewsRouter.route("/create").post((req, res) => {
  reviewController.createReview(req, res);
});

export default reviewsRouter;
