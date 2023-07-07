import express from "express";
import { JobController } from "../controllers/job.controller";

const jobsRouter = express.Router();
const jobController = new JobController();

jobsRouter.route("/update").put((req, res) => {
  jobController.updateJob(req, res);
});

jobsRouter.route("/delete/:id").delete((req, res) => {
  jobController.deleteJob(req, res);
});

jobsRouter.get("/all", (req, res) => {
  jobController.getAllJobs(req, res);
});

jobsRouter.route("/create").post((req, res) => {
  jobController.createJob(req, res);
});

export default jobsRouter;
