const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

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
    console.error('Fehler beim Laden der todos.json:', err.message);
    todos = [];
  }
} else {
  console.log('todos.json nicht gefunden – starte mit leerer Liste.');
}

// Speichern in Datei
function saveTodos() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
  } catch (err) {
    console.error('Fehler beim Schreiben der todos.json:', err.message);
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
  console.log(`API läuft auf Port ${PORT}`);
});
