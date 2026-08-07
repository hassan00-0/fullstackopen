import express from "express";
import Note from "../models/note.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

const notesRouter = express.Router();

// GET all notes
notesRouter.get("/", async (req, res, next) => {
  try {
    const notes = await Note.find({}).populate("user", {
      username: 1,
      name: 1,
    });
    res.json(notes);
  } catch (error) {
    next(error);
  }
});

// GET specific note
notesRouter.get("/:id", async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (note) {
      res.json(note);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

// POST new note
notesRouter.post("/", async (req, res, next) => {
  const body = req.body;

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: "token invalid" });
  }

  const user = await User.findById(decodedToken.id);

  if (!user) {
    return res.status(400).json({ error: "user id missing or not valid" });
  }

  if (!body.content) {
    return res.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user._id,
  });

  try {
    const savedNote = await note.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();

    res.status(201).json(savedNote);
  } catch (error) {
    next(error);
  }
});

// DELETE a note
notesRouter.delete("/:id", async (req, res, next) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// UPDATE a note
notesRouter.put("/:id", async (req, res, next) => {
  const { content, important } = req.body;

  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).end();
    }

    note.content = content;
    note.important = important;
    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    next(error);
  }
});

export default notesRouter;
