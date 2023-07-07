import express from "express";
import { WorkerController } from "../controllers/worker.controller";

const workersRouter = express.Router();
const workerController = new WorkerController();

workersRouter.route("/create").post((req, res) => {
  workerController.createWorker(req, res);
});

workersRouter.route("/update").put((req, res) => {
  workerController.updateWorker(req, res);
});

workersRouter.route("/delete/:id").delete((req, res) => {
  workerController.deleteWorker(req, res);
});

workersRouter.get("/all/:agency", (req, res) => {
  workerController.getAllWorkers(req, res);
});

workersRouter.get("/get-vac/:agency", (req, res) => {
  workerController.getVacancies(req, res);
});

workersRouter.route("/update-vac").put((req, res) => {
  workerController.updateVacancies(req, res);
});

workersRouter.route("/create-vac").post((req, res) => {
  workerController.createVacancies(req, res);
});

export default workersRouter;
