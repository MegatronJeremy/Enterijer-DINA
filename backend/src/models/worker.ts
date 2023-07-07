import mongoose from "mongoose";

const WorkerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    require: true,
  },
  specialty: {
    type: String,
    require: true,
  },
  working: {
    type: Boolean,
    require: true,
    default: false,
  },
  agency: {
    type: String,
    ref: "User",
    require: true,
  },
});

const Worker = mongoose.model("Worker", WorkerSchema, "workers");

export default Worker;
