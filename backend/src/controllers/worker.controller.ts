import express from "express";
import Worker from "../models/worker";
import Vacancy from "../models/vacancies";

export class WorkerController {
  createWorker = async (req: express.Request, res: express.Response) => {
    try {
      const { firstName, lastName, email, phone, specialty, agency } = req.body;

      const worker = await Worker.create({
        firstName,
        lastName,
        email,
        phone,
        specialty,
        agency,
      });

      res.json({ success: true, msg: "Radnik uspešno dodat", worker });
    } catch (err) {
      console.log(err);
      res.json({ success: false, msg: err.message });
    }
  };

  updateWorker = async (req: express.Request, res: express.Response) => {
    try {
      const { _id, firstName, lastName, email, phone, specialty, working } =
        req.body;

      const worker = await Worker.findByIdAndUpdate(
        _id,
        {
          firstName,
          lastName,
          email,
          phone,
          specialty,
          working,
        },
        { new: true }
      );

      if (!worker) {
        return res.json({
          success: false,
          msg: "Radnik nije pronađen",
        });
      }

      res.json({ success: true, msg: "Radnik uspešno ažuriran", worker });
    } catch (err) {
      console.log(err);
      res.json({ success: false, msg: err.message });
    }
  };

  deleteWorker = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;

      const worker = await Worker.findByIdAndDelete(id);

      if (!worker) {
        return res.json({
          success: false,
          msg: "Radnik nije pronađen",
        });
      }

      res.json({ success: true, msg: "Radnik uspešno obrisan" });
    } catch (err) {
      console.log(err);
      res.json({ success: false, msg: err.message });
    }
  };

  getAllWorkers = async (req: express.Request, res: express.Response) => {
    try {
      const { agency } = req.params;

      const workers = await Worker.find({ agency });

      res.json({ success: true, workers });
    } catch (err) {
      console.log(err);
      res.json({ success: false, msg: err.message });
    }
  };

  getVacancies = async (req: express.Request, res: express.Response) => {
    try {
      const { agency } = req.params;

      const vacancy = await Vacancy.findOne({ agency });

      res.json({ success: true, vacancy });
    } catch (err) {
      console.log(err);
      res.json({ success: false, msg: err.message });
    }
  };

  updateVacancies = async (req: express.Request, res: express.Response) => {
    try {
      const { _id, vacancies, vacanciesRequested } = req.body;

      const vacancy = await Vacancy.findByIdAndUpdate(
        _id,
        {
          vacancies,
          vacanciesRequested,
        },
        { new: true }
      );

      if (!vacancy) {
        return res.json({
          success: false,
          msg: "Informacije o radnim mestima nisu pronađene",
        });
      }

      res.json({
        success: true,
        msg: "Informacije o radnim mestima uspešno ažurirane",
        vacancy,
      });
    } catch (err) {
      console.log(err);
      res.json({ success: false, msg: err.message });
    }
  };

  createVacancies = async (req: express.Request, res: express.Response) => {
    try {
      const { vacancies, vacanciesRequested, agency } = req.body;

      const vacancy = await Vacancy.create({
        vacancies,
        vacanciesRequested,
        agency,
      });

      res.json({
        success: true,
        msg: "Informacije o radnim mestima uspešno dodate",
        vacancy,
      });
    } catch (err) {
      console.log(err);
      res.json({ success: false, msg: err.message });
    }
  };
}
