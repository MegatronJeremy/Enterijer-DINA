import * as express from "express";
import * as jwt from "jsonwebtoken";
import User, { IUser } from "../models/user";
import config from "../config/database";
import randomstring from "randomstring";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

export class UserController {
  updateUser = async (req: express.Request, res: express.Response) => {
    try {
      const { username, email, phone, clientInfo, agencyInfo, registered } =
        req.body;

      const user = await User.getUserById(req.body._id);
      user.username = username;
      user.email = email;
      user.phone = phone;
      user.clientInfo = clientInfo;
      user.agencyInfo = agencyInfo;
      user.registered = registered;

      await user.save();

      res.json({ success: true, msg: "Korisnik ažuriran" });
    } catch (err) {
      console.log(err);
      res.json({ success: false, msg: err.message });
    }
  };

  deleteUser = async (req: express.Request, res: express.Response) => {
    try {
      const { username } = req.body;

      let user = await User.findOne({ username: username });
      user.deleted = true;
      user.registered = false;

      await user.save();

      res.json({ success: true, msg: "Korisnik obrisan" });
    } catch (err) {
      console.log(err);
      res.json({ success: false, msg: err.message });
    }
  };

  getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
      const users = await User.find();

      res.json({ success: true, users: users });
    } catch (err) {
      console.log(err);
      res.json({ success: false, msg: err.message });
    }
  };

  register = async (req: express.Request, res: express.Response) => {
    try {
      const {
        username,
        password,
        email,
        phone,
        clientInfo,
        agencyInfo,
        userType,
        registered,
      } = req.body;

      if ((await User.findOne({ username: username })) !== null) {
        res.json({ success: false, msg: "Korisničko ime zauzeto" });
      } else if ((await User.findOne({ email: email })) !== null) {
        res.json({ success: false, msg: "Email zauzet" });
      } else {
        const newUser: IUser = new User({
          username,
          password,
          email,
          phone,
          clientInfo,
          agencyInfo,
          userType,
          registered,
        });

        await User.addUser(newUser);

        res.json({ success: true, msg: "Korisnik registrovan" });
      }
    } catch (err) {
      console.log(err);
      res.json({ success: false, msg: err.message });
    }
  };

  changeProfilePicture = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const { username } = req.params;
      let user = await User.findOne({ username: username });

      console.log(user.profilePicture);
      // Delete the old profile picture
      if (user.profilePicture !== "uploads\\default-profile-picture.jpg") {
        fs.unlinkSync(path.join(__dirname, "../../", user.profilePicture));
      }

      // Set the new profile picture
      user.profilePicture = req.file.path;

      await user.save();

      res.json({ success: true, msg: "Slika profila promenjena" });
    } catch (err) {
      console.log(err);
      res.json({ success: false, msg: err.message });
    }
  };

  changePassword = async (req: express.Request, res: express.Response) => {
    try {
      const { username, oldPassword, newPassword } = req.body;

      let user = await User.getUserByUsername(username);

      const isMatch = await User.comparePasswords(oldPassword, user.password);

      if (!isMatch) {
        return res.json({ success: false, msg: "Pogresna lozinka" });
      }

      user.password = newPassword;

      await User.addUser(user);

      res.json({ success: true, msg: "Lozinka promenjena" });
    } catch (err) {
      console.log(err);
      res.json({ success: false, msg: err.message });
    }
  };

  authenticate = async (req: express.Request, res: express.Response) => {
    try {
      const { username, password, admin } = req.body;

      let user = await User.getUserByUsername(username);

      if (!user) {
        return res.json({ success: false, msg: "Korisnik nije pronadjen" });
      }

      if (!admin && user.userType === "admin") {
        return res.json({
          success: false,
          msg: "Ne mozete se prijaviti na ovom mestu",
        });
      }

      if (admin && user.userType !== "admin") {
        return res.json({
          success: false,
          msg: "Nemate pristup",
        });
      }

      const isMatch = await User.comparePasswords(password, user.password);

      if (!isMatch) {
        return res.json({ success: false, msg: "Pogresna lozinka" });
      }

      const payload = {
        _id: user._id,
        id: user._id,
        username: username,
        phone: user.phone,
        email: user.email,
        userType: user.userType,
      };

      if (user.userType === "client") {
        payload["clientInfo"] = user.clientInfo;
      } else if (user.userType === "agency") {
        payload["agencyInfo"] = user.agencyInfo;
      }

      const token = jwt.sign(payload, config.secret, {
        expiresIn: "1h", // 1 hour
      });

      res.json({
        success: true,
        token: token,
        user: user,
      });
    } catch (err) {
      console.log(err);
      res.json({ success: false, msg: err.message });
    }
  };

  profileData = async (req: express.Request, res: express.Response) => {
    res.json({ user: req.user });
  };

  forgotPassword = async (req: express.Request, res: express.Response) => {
    try {
      const { email } = req.body;

      const user = await User.getUserByEmail(email);

      if (!user) {
        return res.json({
          success: false,
          msg: "Korisnik sa zadatim mail-om nije pronadjen",
        });
      }

      const tempToken = randomstring.generate(40);

      const mailOptions = {
        from: "vukd10@gmail.com",
        to: email,
        subject: "Resetovanje lozinke",
        text: `Kliknite link kako biste resetovali lozinku: http://localhost:4200/reset-password?token=${tempToken}`,
      };

      // Nodemailer configuration
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "vukd10@gmail.com",
          pass: "xzojtgzfxmayboqy",
        },
      });

      await transporter.sendMail(mailOptions);

      user.resetToken = {
        token: tempToken,
        expires: Date.now() + 600000, // 10 minutes
      };

      await user.save();

      res.json({ success: true, msg: "Email poslat" });
    } catch (err) {
      console.log(err);
      res.json({ success: false, msg: "Greška prilikom slanja emaila" });
    }
  };

  resetPassword = async (req: express.Request, res: express.Response) => {
    try {
      const { token, password } = req.body;

      const user = await User.getUserByResetToken(token);

      if (!user) {
        return res.json({
          success: false,
          msg: "Link za resetovanje lozinke nije validan",
        });
      }

      if (user.resetToken.expires < Date.now()) {
        user.resetToken = undefined;
        await user.save();

        return res.json({
          success: false,
          msg: "Link za resetovanje lozinke je istekao",
        });
      }

      user.password = password;
      user.resetToken = undefined;

      await User.addUser(user);

      res.json({ success: true, msg: "Lozinka resetovana" });
    } catch (err) {
      console.log(err);
      res.json({ success: false, msg: "Greška prilikom resetovanja lozinke" });
    }
  };
}
