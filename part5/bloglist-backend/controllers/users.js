import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";

const usersRouter = express.Router();

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await User.find({}).populate("blogs");
    res.json(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/", async (req, res, next) => {
  try {
    const { username, name, password } = req.body;

    if (!username) {
      return res.status(400).json({ error: "username is required" });
    }

    if (username.length < 3) {
      return res
        .status(400)
        .json({
          error: "username shorter than the minimum allowed length (3)",
        });
    }

    if (!password) {
      return res.status(400).json({ error: "password is required" });
    }

    if (password.length < 3) {
      return res
        .status(400)
        .json({ error: "password must be at least 3 characters long" });
    }

    const saltsRound = 10;
    const passwordHash = await bcrypt.hash(password, saltsRound);

    const user = new User({
      username,
      name,
      passwordHash,
    });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    if (error.name === "MongoServerError" && error.code === 11000) {
      return res.status(400).json({ error: "username already exists" });
    }
    next(error);
  }
});
export default usersRouter;
