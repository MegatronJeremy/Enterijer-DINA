import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  object: {
    type: String,
    ref: "CanvasObject",
    required: true,
  },
  agency: {
    type: String,
    ref: "User",
    required: true,
  },
  client: {
    type: String,
    ref: "User",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["created", "rejected", "pending", "active", "completed"],
    default: "created",
    required: true,
  },
  payOffer: {
    type: Number,
    required: false,
  },
  cancellationReason: {
    type: String,
    required: false,
  },
});

JobSchema.set("toJSON", { virtuals: true });

const Job = mongoose.model("Job", JobSchema, "jobs");

export default Job;
