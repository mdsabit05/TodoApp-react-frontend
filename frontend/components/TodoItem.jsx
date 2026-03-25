import React from "react";

const TodoItem = ({ todo, deleteTodo, toggleTodo }) => {
  return (
   <li className="todo-item">
  <div className="left">
    <input checked={todo.completed} onChange={toggleTodo} type="checkbox" />
    <span
      className="todo-text"
      style={{
        textDecoration: todo.completed ? "line-through" : "none",
      }}
    >
      {todo.text}
    </span>
  </div>

  <div className="right">
    <span className="category-badge">{todo.category}</span>
    <button className="delete" onClick={deleteTodo}>❌</button>
  </div>
</li>
  );
};

export default TodoItem;
