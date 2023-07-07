import mongoose from "mongoose";

const CanvasObjectSchema = new mongoose.Schema({
  user: { type: String, required: true },
  type: { type: String, required: true },
  address: { type: String, required: true },
  area: { type: Number, required: true },
  roomNum: { type: Number, required: true },
  rooms: [
    {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      borderSize: { type: Number, required: true, default: 3 },
      roomState: {
        type: String,
        enum: ["working", "finished", "invalid", "not started"],
        default: "not started",
        required: true,
      },
    },
  ],
  doors: [
    {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },
  ],
  beingCreated: { type: Boolean, required: true, default: false },
});

const CanvasObject = mongoose.model(
  "CanvasObject",
  CanvasObjectSchema,
  "objects"
);

export default CanvasObject;
