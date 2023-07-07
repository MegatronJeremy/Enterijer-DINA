import express, { Router } from "express";
import cors from "cors";
import passport from "passport";
import mongoose from "mongoose";
import config from "./config/database";
import session from "express-session";
import path from "path";
import passportConfig from "./config/passport";
import canvasObjectRouter from "./routes/canvasObject.routes";
import reviewsRouter from "./routes/review.routes";
import jobsRouter from "./routes/job.routes";
import userRouter from "./routes/users.routes";
import workersRouter from "./routes/worker.routes";

const app = express();

// Port Number
const port = 4000;

// CORS Middleware
app.use(cors());

// Body Parser Middleware
app.use(express.json());

// Enable sessions using express-session middleware
app.use(
  session({
    secret: "11037",
    resave: false,
    saveUninitialized: false,
  })
);

// Set Static Folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

// Generic Error Handling Middleware
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(505).json({ success: false, msg: "Internal server error" });
});

// Routes
const router = Router();

router.use("/users", userRouter);
router.use("/objects", canvasObjectRouter);
router.use("/reviews", reviewsRouter);
router.use("/jobs", jobsRouter);
router.use("/workers", workersRouter);

app.use("/", router);

// Index Route
app.get("/", (_req, res) => {
  res.send("Invalid Endpoint");
});

// MongoDB Connection
mongoose.set("strictQuery", false);

mongoose.connect(config.database);

mongoose.connection.on("connected", () => {
  console.log("Connected to database " + config.database);
});

mongoose.connection.on("error", (err) => {
  console.log("Database error: " + err);
});

// Start Server
app.listen(port, () => console.log(`Express server running on port ` + port));
