import express from "express";
import passport from "passport";
import { UserController } from "../controllers/users.controller";
import upload from "../config/multer";

const usersRouter = express.Router();

usersRouter
  .route("/register")
  .post(upload.single("profilePicture"), (req, res) => {
    new UserController().register(req, res);
  });

usersRouter.route("/delete").post((req, res) => {
  new UserController().deleteUser(req, res);
});

usersRouter.route("/update-user").post((req, res) => {
  new UserController().updateUser(req, res);
});

usersRouter.route("/all-users").get((req, res) => {
  new UserController().getAllUsers(req, res);
});

usersRouter
  .route("/:username/change-profile-picture")
  .post(upload.single("profilePicture"), (req, res) => {
    new UserController().changeProfilePicture(req, res);
  });

usersRouter.route("/authenticate").post((req, res) => {
  new UserController().authenticate(req, res);
});

usersRouter
  .route("/profile")
  .get(passport.authenticate("jwt", { session: false }), (req, res) => {
    new UserController().profileData(req, res);
  });

usersRouter.route("/forgot-password").post((req, res) => {
  new UserController().forgotPassword(req, res);
});

usersRouter.route("/reset-password").post((req, res) => {
  new UserController().resetPassword(req, res);
});

usersRouter.route("/change-password").post((req, res) => {
  new UserController().changePassword(req, res);
});

export default usersRouter;
