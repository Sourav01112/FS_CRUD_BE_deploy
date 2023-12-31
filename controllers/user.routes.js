const express = require("express");
const { UserModel } = require("../model/user.model");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


// register
userRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.json({ msg: "user already exists" });
    }
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        return res.json({ err: err.message });
      } else {
        const user = UserModel({ name, email, password: hash });
        await user.save();
      }
    });
    res.status(200).json({
      msg: "The new user has been registered",
      registeredUser: req.body,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// login
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      bcrypt.compare(password, userExists.password, (err, result) => {
        if (result) {
          var token = jwt.sign(
            { userID: userExists._id, userName: userExists.name },
            process.env.SECRET_KEY
          );

          res.status(200).json({ msg: "Login Successful", token });
        } else {
          res.status(200).json({ err: "Wrong credentials" });
        }
      });
    } else {
      res.status(200).json({ msg: "user does not exist" });
    }
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

module.exports = { userRouter };
