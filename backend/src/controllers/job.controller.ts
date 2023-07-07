import express from "express";
import Job from "../models/job";
import CanvasObject from "../models/canvasObject";

export class JobController {
  updateJob = async (req: express.Request, res: express.Response) => {
    try {
      const { _id, status, payOffer, cancellationReason, object } = req.body;

      const job = await Job.findById(_id);

      if (!job) {
        return res.json({
          success: false,
          msg: "Posao nije pronađen",
        });
      }

      job.status = status;
      job.payOffer = payOffer;
      job.cancellationReason = cancellationReason;

      await job.save();

      let canvasObject = await CanvasObject.findById(object._id);
      canvasObject.beingCreated = object.beingCreated;
      canvasObject.rooms = object.rooms;

      await canvasObject.save();

      return res.json({
        success: true,
        msg: "Posao uspešno ažuriran",
      });
    } catch (err) {
      console.log(err);
      return res.json({ success: false, msg: err.message });
    }
  };

  deleteJob = async (req: express.Request, res: express.Response) => {
    try {
      const jobId = req.params.id;

      await Job.findByIdAndDelete(jobId);

      return res.json({ success: true, msg: "Posao uspešno obrisan" });
    } catch (err) {
      console.log(err);
      return res.json({ success: false, msg: err.message });
    }
  };

  getAllJobs = async (req: express.Request, res: express.Response) => {
    try {
      const jobs = await Job.find()
        .populate("object")
        .populate("client")
        .populate("agency");
      return res.json({ success: true, jobs });
    } catch (err) {
      console.log(err);
      return res.json({ success: false, msg: err.message });
    }
  };

  createJob = async (req: express.Request, res: express.Response) => {
    try {
      const { object_id, agency_id, client_id, startDate, endDate } = req.body;

      const object = await CanvasObject.findById(object_id);

      if (!object) {
        return res.json({
          success: false,
          msg: "Objekat nije pronađen",
        });
      }

      object.beingCreated = true;
      await object.save();

      const job = await Job.create({
        object: object_id,
        agency: agency_id,
        client: client_id,
        startDate,
        endDate,
      });

      return res.json({ success: true, msg: "Posao uspešno kreiran", job });
    } catch (err) {
      console.log(err);
      return res.json({ success: false, msg: err.message });
    }
  };
}
