import pool from "./db.js";
import winston from "winston";

// Todos aus der Datenbank abfragen
async function getAllTodos() {
  const result = await pool.query("SELECT * FROM todos ORDER BY id ASC");
  return result.rows;
}

// Einzelnes Todo nach ID abrufen
async function getTodoById(id) {
  const result = await pool.query("SELECT * FROM todos WHERE id = $1", [id]);
  return result.rows[0];
}

// Neues Todo einfügen
async function createTodo(text) {
  if (!text || typeof text !== "string" || text.trim() === "") {
    const error = new Error("Ungültiger Text für Todo.");
    error.status = 400;
    throw error;
  }

  const result = await pool.query(
    "INSERT INTO todos (text, completed) VALUES ($1, false) RETURNING *",
    [text]
  );
  return result.rows[0];
}

// Todo aktualisieren (z.B. completed toggeln)
async function updateTodo(id, completed) {
  if (typeof completed !== "boolean") {
    const error = new Error("Feld 'completed' muss ein Boolean sein.");
    error.status = 400;
    throw error;
  }

  const result = await pool.query(
    "UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *",
    [completed, id]
  );
  return result.rows[0];
}

// Todo löschen
async function deleteTodo(id) {
  const result = await pool.query("DELETE FROM todos WHERE id = $1", [id]);
  return result.rowCount > 0;
}

export {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
};
