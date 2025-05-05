import { useState, useEffect } from 'react'
import './App.css'
import TodoList from './components/TodoList'
import TodoForm from './components/TodoForm'
import TodoFilter from './components/TodoFilter'

const API_URL = import.meta.env.VITE_API_URL

function App() {
  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState('all')

  // Todos vom Backend laden
  useEffect(() => {
    fetch(`${API_URL}/api/todos`)
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error('Fehler beim Laden der Todos:', err))
  }, [])

  // Neues Todo ans Backend senden
  const addTodo = (text) => {
    if (text.trim() === '') return

    fetch(`${API_URL}/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
      .then(res => res.json())
      .then(newTodo => setTodos(prev => [...prev, newTodo]))
      .catch(err => console.error('Fehler beim Hinzufügen:', err))
  }

  // Todo lokal toggeln (könnte später mit PUT/PATCH ergänzt werden)
  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  // Todo im Backend löschen
  const deleteTodo = (id) => {
    fetch(`${API_URL}/api/todos/${id}`, {
      method: 'DELETE'
    })
      .then(() => setTodos(prev => prev.filter(t => t.id !== id)))
      .catch(err => console.error('Fehler beim Löschen:', err))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  return (
    <div className="todo-app">
      <h1>To-Do Liste</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoFilter filter={filter} onFilterChange={setFilter} />
      <TodoList
        todos={filteredTodos}
        onToggleTodo={toggleTodo}
        onDeleteTodo={deleteTodo}
      />
      <div className="todo-stats">
        <p>Gesamt: {todos.length} | Offen: {todos.filter(t => !t.completed).length} | Erledigt: {todos.filter(t => t.completed).length}</p>
      </div>
    </div>
  )
}

export default App
