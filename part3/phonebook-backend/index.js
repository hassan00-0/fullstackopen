import express from "express";
import morgan from "morgan";
import cors from "cors";
import Person from "./models/person.js";

morgan.token("body", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "";
});

const app = express();

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);
app.use(cors());
app.use(express.static("dist"));

// get all people
app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((person) => res.json(person))
    .catch((error) => next(error));
});

// how many people in the phonebook
app.get("/api/info", (req, res, next) => {
  Person.countDocuments({})
    .then((count) => {
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
      `);
    })
    .catch((error) => next(error));
});

// get specific person
app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).json({ error: "person not found" });
      }
    })
    .catch((error) => next(error));
});

// add a new person
app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: "missing entries" });
  }

  Person.findOne({ name: name })
    .then((nameExists) => {
      if (nameExists) {
        return res.status(400).json({
          error: `${nameExists.name} already exists in the phonebook`,
        });
      }
      const person = new Person({
        name: name,
        number: number,
      });
      return person.save();
    })
    .then((savedPerson) => res.status(201).json(savedPerson))
    .catch((error) => next(error));
});

// delete a person
app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((person) => {
      if (!person) {
        return res.status(404).json({ error: "person not found" });
      }
      res.status(204).end();
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
