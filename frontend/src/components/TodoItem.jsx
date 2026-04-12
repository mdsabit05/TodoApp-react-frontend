import React from "react";

const TodoItem = ({ todo, deleteTodo, toggleTodo }) => {
  return (
   <li className="todo-item">
  <div className="left">
    <input checked={todo.completed || false} onChange={() => toggleTodo(todo._id)} type="checkbox" />
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
    <button className="delete" onClick={()=>{deleteTodo(todo._id)}}>❌</button>
  </div>
</li>
  );
};

export default TodoItem;
