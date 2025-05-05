function TodoList({ todos, onToggleTodo, onDeleteTodo }) {
  // Leere Liste anzeigen, wenn keine Todos vorhanden sind
  if (todos.length === 0) {
    return <p className="empty-list">Keine Aufgaben vorhanden</p>
  }

  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
          <div className="todo-content">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggleTodo(todo.id)}
              className="todo-checkbox"
            />
            <span className="todo-text">{todo.text}</span>
          </div>
          <button 
            onClick={() => onDeleteTodo(todo.id)} 
            className="delete-btn"
          >
            Löschen
          </button>
        </li>
      ))}
    </ul>
  )
}

export default TodoList