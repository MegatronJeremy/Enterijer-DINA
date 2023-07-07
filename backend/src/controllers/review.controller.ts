import express from "express";
import Review from "../models/review";
import User from "../models/user";
import { faker } from "@faker-js/faker";

export class ReviewController {
  updateReview = async (req: express.Request, res: express.Response) => {
    try {
      const { text, rating } = req.body;

      const review = await Review.findById(req.body._id);

      if (!review) {
        return res.json({
          success: false,
          msg: "Recenzija nije pronađena",
        });
      }

      review.text = text;
      review.rating = rating;
      review.date = new Date(Date.now());

      await review.save();

      res.json({ success: true, msg: "Recenzija uspešno ažurirana" });
    } catch (err) {
      console.log(err);
      res.json({ success: false, msg: err.message });
    }
  };

  deleteReview = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;

      await Review.findByIdAndDelete(id);

      res.json({ success: true, msg: "Recenzija uspešno obrisana" });
    } catch (err) {
      console.log(err);
      res.json({ success: false, msg: err.message });
    }
  };

  getAllReviews = async (req: express.Request, res: express.Response) => {
    try {
      const { agency, personalized } = req.params;
      const reviews = await Review.find({ agency: agency });

      for (let review of reviews) {
        if (personalized === "true") {
          const user = await User.findOne({ username: review.client });
          review.profilePicture = user.profilePicture;
          review.fullName =
            user.clientInfo?.firstName + " " + user.clientInfo?.lastName;
        } else {
          review.profilePicture = "uploads//default-profile-picture.jpg";
          review.fullName = faker.person.fullName();
        }
      }

      res.json({ success: true, reviews });
    } catch (err) {
      console.log(err);
      res.json({ success: false, msg: err.message });
    }
  };

  createReview = async (req: express.Request, res: express.Response) => {
    try {
      const { client, agency, text, rating } = req.body;

      await Review.create({
        client,
        agency,
        text,
        rating,
      });

      res.json({ success: true, msg: "Recenzija uspešno kreirana" });
    } catch (err) {
      console.log(err);
      res.json({ success: false, msg: err.message });
    }
  };
}
