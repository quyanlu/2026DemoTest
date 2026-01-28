import React, { useState } from 'react';
import './index.scss';

// 定义待办事项类型
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoListPageProps {}

const TodoListPage: React.FC<TodoListPageProps> = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleAddTodo: React.FormEventHandler<HTMLButtonElement> = () => {
    if (inputValue.trim()) {
      setTodos([...todos, { id: Date.now(), text: inputValue, completed: false }]);
      setInputValue('');
    }
  };

  const handleToggleTodo: (id: number) => void = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDeleteTodo: (id: number) => void = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="page">
      <h2>待办事项演示</h2>
      <div className="todo-input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="输入待办事项"
          className="todo-input"
        />
        <button onClick={handleAddTodo} className="btn btn-primary">添加</button>
      </div>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className="todo-item">
            <span 
              className={`todo-text ${todo.completed ? 'completed' : ''}`}
              onClick={() => handleToggleTodo(todo.id)}
            >
              {todo.text}
            </span>
            <button 
              onClick={() => handleDeleteTodo(todo.id)}
              className="btn btn-secondary todo-delete-btn"
            >
              删除
            </button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && <p className="todo-empty">暂无待办事项</p>}
    </div>
  );
};

export default TodoListPage;