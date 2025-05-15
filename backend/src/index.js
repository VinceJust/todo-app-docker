import express from "express";
import cors from "cors";
import winston from "winston";
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
} from "./todoService.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Winston Logger Setup
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()],
});

logger.info("Starting backend API...");

// Log DB credentials
logger.info("Database Configuration (from ENV):", {
  DB_HOST: process.env.DB_HOST || "[not set]",
  DB_PORT: process.env.DB_PORT || "[not set]",
  DB_USER: process.env.DB_USER || "[not set]",
  DB_NAME: process.env.DB_NAME || "[not set]",
  DB_PASSWORD: process.env.DB_PASSWORD ? "[REDACTED]" : "[not set]",
});

app.use(cors());
app.use(express.json());

// Healthcheck-Endpunkt für Docker
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// GET all Todos
app.get("/api/todos", async (req, res, next) => {
  try {
    const todos = await getAllTodos();
    res.json(todos);
  } catch (err) {
    next(err);
  }
});

// GET Todo by ID
app.get("/api/todos/:id", async (req, res, next) => {
  try {
    const todo = await getTodoById(parseInt(req.params.id));
    todo ? res.json(todo) : res.status(404).send("Nicht gefunden");
  } catch (err) {
    next(err);
  }
});

// POST new Todo
app.post("/api/todos", async (req, res, next) => {
  try {
    const newTodo = await createTodo(req.body.text);
    res.status(201).json(newTodo);
  } catch (err) {
    next(err);
  }
});

// PUT update Todo
app.put("/api/todos/:id", async (req, res, next) => {
  try {
    const updated = await updateTodo(parseInt(req.params.id), req.body.completed);
    updated ? res.json(updated) : res.status(404).send("Nicht gefunden");
  } catch (err) {
    next(err);
  }
});

// DELETE Todo
app.delete("/api/todos/:id", async (req, res, next) => {
  try {
    const success = await deleteTodo(parseInt(req.params.id));
    success ? res.status(204).end() : res.status(404).send("Nicht gefunden");
  } catch (err) {
    next(err);
  }
});

// Error handling
app.use((err, req, res, next) => {
  logger.error("Fehler:", err.message);
  res.status(500).json({ error: "Interner Serverfehler" });
});

// Fallback
app.use((req, res) => {
  res.status(404).send("Route nicht gefunden");
});

app.listen(PORT, "0.0.0.0", () => {
  logger.info(`API läuft auf Port ${PORT}`);
});
