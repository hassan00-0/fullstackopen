import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Note from "./models/note.js";

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

// GET all notes
app.get("/api/notes", (req, res, next) => {
  Note.find({})
    .then((notes) => res.json(notes))
    .catch((error) => next(error));
});

// GET specific note
app.get("/api/notes/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// POST new note
app.post("/api/notes", (req, res, next) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((savedNote) => res.json(savedNote))
    .catch((error) => next(error));
});

// DELETE a note
app.delete("/api/notes/:id", (req, res, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

// UPDATE a note
app.put("/api/notes/:id", (req, res, next) => {
  const { content, important } = req.body;

  Note.findById(req.params.id)
    .then((note) => {
      if (!note) {
        return res.status(404).end();
      }

      note.content = content;
      note.important = important;

      return note.save().then((updatedNote) => {
        res.json(updatedNote);
      });
    })
    .catch((error) => next(error));
});

// 404 handler for unknown endpoints
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

// Error handler
const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
