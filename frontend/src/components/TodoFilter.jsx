function TodoFilter({ filter, onFilterChange }) {
    return (
      <div className="todo-filter">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => onFilterChange('all')}
        >
          Alle
        </button>
        <button 
          className={filter === 'active' ? 'active' : ''} 
          onClick={() => onFilterChange('active')}
        >
          Offen
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''} 
          onClick={() => onFilterChange('completed')}
        >
          Erledigt
        </button>
      </div>
    )
  }
  
  export default TodoFilter