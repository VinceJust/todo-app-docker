const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

let todos = [
  { id: 1, text: 'Erste Aufgabe', done: false },
  { id: 2, text: 'Zweite Aufgabe', done: true }
];

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
    done: false
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// DELETE Todo
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  if (index > -1) {
    todos.splice(index, 1);
    res.status(204).end();
  } else {
    res.status(404).send('Nicht gefunden');
  }
});

// Fallback für nicht definierte Routen
app.use((req, res) => {
  res.status(404).send('Route nicht gefunden');
});

app.listen(PORT, () => {
  console.log(`API läuft auf Port ${PORT}`);
});
