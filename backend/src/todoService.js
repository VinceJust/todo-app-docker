// backend/src/todoService.js

import pool from "./db.js"; // Note the .js extension
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
  const result = await pool.query(
    "INSERT INTO todos (text, completed) VALUES ($1, false) RETURNING *",
    [text]
  );
  return result.rows[0];
}

// Todo löschen
async function deleteTodo(id) {
  const result = await pool.query("DELETE FROM todos WHERE id = $1", [id]);
  return result.rowCount > 0;
}

export { getAllTodos, getTodoById, createTodo, deleteTodo };
