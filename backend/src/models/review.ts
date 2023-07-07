import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  client: {
    type: String,
    required: true,
  },
  agency: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  profilePicture: {
    type: String,
    required: false,
  },
  fullName: {
    type: String,
    required: false,
  },
});

const Review = mongoose.model("Review", ReviewSchema, "reviews");

export default Review;
