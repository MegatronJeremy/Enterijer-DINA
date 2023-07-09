import express from "express";
import CanvasObject from "../models/canvasObject";

export class CanvasObjectController {
  updateCanvasObject = async (req: express.Request, res: express.Response) => {
    try {
      const { type, address, area, roomNum, doors, rooms, activelyWorkedOn } =
        req.body;

      const canvasObject = await CanvasObject.findById(req.body._id);

      if (!canvasObject) {
        return res.json({
          success: false,
          msg: "Objekat nije pronađen",
        });
      }

      canvasObject.type = type;
      canvasObject.address = address;
      canvasObject.area = area;
      canvasObject.doors = doors;
      canvasObject.roomNum = roomNum;
      canvasObject.rooms = rooms;
      canvasObject.activelyWorkedOn = activelyWorkedOn;

      await canvasObject.save();

      res.json({ success: true, msg: "Objekat uspešno ažuriran" });
    } catch (err) {
      console.log(err);
      res.json({ success: false, msg: err.message });
    }
  };

  deleteCanvasObject = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.body;

      await CanvasObject.findByIdAndDelete(id);

      res.json({ success: true, msg: "Objekat uspešno obrisan" });
    } catch (err) {
      console.log(err);
      res.json({ success: false, msg: err.message });
    }
  };

  getAllCanvasObjects = async (req: express.Request, res: express.Response) => {
    try {
      const canvasObjects = await CanvasObject.find();

      res.json({ success: true, canvasObjects });
    } catch (err) {
      console.log(err);
      res.json({ success: false, msg: err.message });
    }
  };

  createCanvasObject = async (req: express.Request, res: express.Response) => {
    try {
      const { type, address, area, roomNum, doors, rooms, user } = req.body;

      await CanvasObject.create({
        user,
        type,
        address,
        area,
        roomNum,
        rooms,
        doors,
      });

      res.json({ success: true, msg: "Objekat uspešno kreiran" });
    } catch (err) {
      console.log(err);
      res.json({ success: false, msg: err.message });
    }
  };

  getAllForUser = async (req: express.Request, res: express.Response) => {
    try {
      const { username } = req.params;

      const canvasObjects = await CanvasObject.find({ user: username });

      res.json({ success: true, canvasObjects });
    } catch (err) {
      console.log(err);
      res.json({ success: false, msg: err.message });
    }
  };
}
