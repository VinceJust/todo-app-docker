import express from "express";
import cors from "cors";
import winston from "winston";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} from "./todoService.js";
import pool from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Winston Logger Setup
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return `${timestamp} [${level}]: ${message} ${
        Object.keys(meta).length ? JSON.stringify(meta) : ""
      }`;
    })
  ),
  transports: [new winston.transports.Console()],
});

logger.info("Starting backend API...");
logger.info("Database Configuration (from ENV):", {
  DB_HOST: process.env.DB_HOST || "[not set]",
  DB_PORT: process.env.DB_PORT || "[not set]",
  DB_USER: process.env.DB_USER || "[not set]",
  DB_NAME: process.env.DB_NAME || "[not set]",
  DB_PASSWORD: process.env.DB_PASSWORD ? "[REDACTED]" : "[not set]",
});

app.use(cors());
app.use(express.json());

// Healthcheck
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).send("OK");
  } catch (err) {
    logger.error("Healthcheck-Fehler:", err);
    res.status(503).send("DB nicht erreichbar");
  }
});

// API-Routen
app.get("/api/todos", async (req, res, next) => {
  try {
    const todos = await getAllTodos();
    res.json(todos);
  } catch (err) {
    next(err);
  }
});

app.get("/api/todos/:id", async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Ungültige ID" });

  try {
    const todo = await getTodoById(id);
    todo ? res.json(todo) : res.status(404).send("Nicht gefunden");
  } catch (err) {
    next(err);
  }
});

app.post("/api/todos", async (req, res, next) => {
  const { text } = req.body;
  if (!text || typeof text !== "string" || text.trim() === "") {
    logger.warn("Ungültiger Text empfangen:", { body: req.body });
    return res.status(400).json({ error: "Ungültiger oder fehlender Text" });
  }

  try {
    const newTodo = await createTodo(text.trim());
    res.status(201).json(newTodo);
  } catch (err) {
    logger.error("Fehler beim Erstellen eines Todos:", err);
    next(err);
  }
});

app.put("/api/todos/:id", async (req, res, next) => {
  const id = parseInt(req.params.id);
  const { completed } = req.body;

  if (isNaN(id)) return res.status(400).json({ error: "Ungültige ID" });
  if (typeof completed !== "boolean") {
    return res
      .status(400)
      .json({ error: 'Feld "completed" muss ein Boolean sein' });
  }

  try {
    const updated = await updateTodo(id, completed);
    updated ? res.json(updated) : res.status(404).send("Nicht gefunden");
  } catch (err) {
    next(err);
  }
});

app.delete("/api/todos/:id", async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Ungültige ID" });

  try {
    const success = await deleteTodo(id);
    success ? res.status(204).end() : res.status(404).send("Nicht gefunden");
  } catch (err) {
    next(err);
  }
});

// Fehlerbehandlung
app.use((err, req, res, next) => {
  logger.error("Unerwarteter Fehler:", {
    message: err.message,
    stack: err.stack,
  });
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Interner Serverfehler" });
});

// Fallback
app.use((req, res) => {
  res.status(404).send("Route nicht gefunden");
});

// Warten auf DB-Verbindung
async function waitForDatabase() {
  const maxRetries = 10;
  for (let i = 0; i < maxRetries; i++) {
    try {
      await pool.query("SELECT 1");
      logger.info("Datenbankverbindung erfolgreich.");
      return;
    } catch (err) {
      logger.warn(
        `Datenbank nicht erreichbar (Versuch ${i + 1}/${maxRetries})...`
      );
      await new Promise((res) => setTimeout(res, 3000));
    }
  }
  logger.error(
    "Fehler: DB nicht erreichbar nach mehreren Versuchen. Beende..."
  );
  process.exit(1);
}

// Initiales SQL-Schema ausführen
async function runInitialSchema() {
  try {
    const schemaPath = path.join(__dirname, "..", "sql", "initial_schema.sql"); // <- Änderung: ".."
    const schema = await fs.readFile(schemaPath, "utf-8");
    await pool.query(schema);
    logger.info("Initiales SQL-Schema erfolgreich ausgeführt.");
  } catch (err) {
    logger.error("Fehler beim Ausführen des Initialschemas:", err);
    process.exit(1);
  }
}

// Server starten nach erfolgreicher DB-Init
waitForDatabase()
  .then(runInitialSchema)
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      logger.info(`API läuft auf Port ${PORT}`);
    });
  });
