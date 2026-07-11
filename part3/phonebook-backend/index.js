import express from "express";
import morgan from "morgan";

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

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

// get all people
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

// how many people in the phonebook
app.get("/api/info", (req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `);
});

// get specific person
app.get("/api/persons/:id", (req, res) => {
  const person = persons.find((p) => p.id === req.params.id);
  if (!person) {
    return res.status(404).json({ error: "person not in phonebook..." });
  }
  res.json(person);
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;
  const nameExists = persons.find((p) => p.name === name);

  if (!name || !number) {
    return res.status(400).json({ error: "missing enteries" });
  }

  if (nameExists) {
    return res.status(400).json({
      error: `${nameExists.name} already exists in the phonebook ...`,
    });
  }

  const person = {
    id: String(Math.floor(Math.random() * 1000000000)),
    name: name,
    number: number,
  };
  persons = persons.concat(person);

  res.status(201).json(person);
});
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
