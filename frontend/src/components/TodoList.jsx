import React from "react";
import TodoItem from "./TodoItem";

const TodoList = ({ todos, deleteTodo, toggleTodo }) => {
  return (
    <div className="todo-list">
      {todos.map((todo, index) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          deleteTodo={() => deleteTodo(todo._id)}
          toggleTodo={() => {
            toggleTodo(index);
          }}
        />
      ))}
    </div>
  );
};

export default TodoList;
