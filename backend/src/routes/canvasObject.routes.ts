import express from "express";
import { CanvasObjectController } from "../controllers/canvasObject.controller";

const canvasObjectRouter = express.Router();

canvasObjectRouter.route("/create").post((req, res) => {
  new CanvasObjectController().createCanvasObject(req, res);
});

canvasObjectRouter.route("/delete").post((req, res) => {
  new CanvasObjectController().deleteCanvasObject(req, res);
});

canvasObjectRouter.route("/update").post((req, res) => {
  new CanvasObjectController().updateCanvasObject(req, res);
});

canvasObjectRouter.route("/all").get((req, res) => {
  new CanvasObjectController().getAllCanvasObjects(req, res);
});

canvasObjectRouter.route("/get/:username").get((req, res) => {
  new CanvasObjectController().getAllForUser(req, res);
});

export default canvasObjectRouter;
