const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const winston = require('winston');

const app = express();
const PORT = process.env.PORT || 3000;

// Winston Logger Setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()]
});

logger.info('Starting backend API...');

// Logge DB-Zugangsdaten aus ENV (Passwort nicht im Klartext!)
logger.info('Database Configuration (from ENV):', {
  DB_HOST: process.env.DB_HOST || '[not set]',
  DB_PORT: process.env.DB_PORT || '[not set]',
  DB_USER: process.env.DB_USER || '[not set]',
  DB_NAME: process.env.DB_NAME || '[not set]',
  DB_PASSWORD: process.env.DB_PASSWORD ? '[REDACTED]' : '[not set]'
});

// Datenpfad im Container
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'todos.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Lade bestehende Daten oder starte mit leerer Liste
let todos = [];
if (fs.existsSync(DATA_FILE)) {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    todos = JSON.parse(raw);
  } catch (err) {
    logger.error('Fehler beim Laden der todos.json:', err.message);
    todos = [];
  }
} else {
  logger.warn('todos.json nicht gefunden – starte mit leerer Liste.');
}

// Speichern in Datei
function saveTodos() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
  } catch (err) {
    logger.error('Fehler beim Schreiben der todos.json:', err.message);
  }
}

app.use(cors());
app.use(express.json());

// GET alle Todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// GET Todo nach ID
app.get('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  todo ? res.json(todo) : res.status(404).send('Nicht gefunden');
});

// POST neues Todo
app.post('/api/todos', (req, res) => {
  const newTodo = {
    id: Date.now(),
    text: req.body.text,
    completed: false
  };
  todos.push(newTodo);
  saveTodos();
  res.status(201).json(newTodo);
});

// DELETE Todo
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  if (index > -1) {
    todos.splice(index, 1);
    saveTodos();
    res.status(204).end();
  } else {
    res.status(404).send('Nicht gefunden');
  }
});

// Fallback
app.use((req, res) => {
  res.status(404).send('Route nicht gefunden');
});

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`API läuft auf Port ${PORT}`);
});
