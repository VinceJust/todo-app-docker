import { useState, useEffect } from "react";
import "./App.css";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";
import TodoFilter from "./components/TodoFilter";

const API_URL = import.meta.env.VITE_API_URL;
console.log("🔍 API_URL:", API_URL);
console.log("🌐 import.meta.env:", import.meta.env);
console.log("API_URL zur Laufzeit:", API_URL);

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [errorMessage, setErrorMessage] = useState("");

  // Todos vom Backend laden
  useEffect(() => {
    fetch(`${API_URL}/todos`)
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Laden der Todos");
        return res.json();
      })
      .then((data) => setTodos(data))
      .catch((err) => {
        console.error(err);
        setErrorMessage("⚠️ Aufgaben konnten nicht geladen werden. Bitte später erneut versuchen.");
      });
  }, []);

  // Neues Todo ans Backend senden
  const addTodo = (text) => {
    if (text.trim() === "") return;

    fetch(`${API_URL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Hinzufügen");
        return res.json();
      })
      .then((newTodo) => setTodos((prev) => [...prev, newTodo]))
      .catch((err) => {
        console.error(err);
        setErrorMessage("⚠️ Aufgabe konnte nicht hinzugefügt werden.");
      });
  };

  // Todo aktualisieren
  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (!res.ok) throw new Error("Fehler beim Aktualisieren");

      const updated = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      console.error(err);
      setErrorMessage("⚠️ Aufgabe konnte nicht aktualisiert werden.");
    }
  };

  // Todo im Backend löschen
  const deleteTodo = (id) => {
    fetch(`${API_URL}/todos/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Löschen");
        setTodos((prev) => prev.filter((t) => t.id !== id));
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage("⚠️ Aufgabe konnte nicht gelöscht werden.");
      });
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="todo-app">
      <h1>To-Do Liste</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <TodoForm onAddTodo={addTodo} />
      <TodoFilter filter={filter} onFilterChange={setFilter} />
      <TodoList
        todos={filteredTodos}
        onToggleTodo={toggleTodo}
        onDeleteTodo={deleteTodo}
      />
      <div className="todo-stats">
        <p>
          Gesamt: {todos.length} | Offen:{" "}
          {todos.filter((t) => !t.completed).length} | Erledigt:{" "}
          {todos.filter((t) => t.completed).length}
        </p>
      </div>
    </div>
  );
}

export default App;
