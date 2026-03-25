import React from "react";

const TodoInput = ({
  todo,
  setTodo,
  addTodo,
  category,
  setCategory,
  error,
}) => {
  return (
    <div className="todo-input">
      <input
        type="text"
        placeholder="Add a new task..."
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addTodo();
          }
        }}
        className={error.todo ? "input error" : "input"}
      />

      <input
        type="text"
        placeholder="Enter category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className={error.category ? "input error" : "input"}
      />

      <button onClick={addTodo}>Add</button>
    </div>
  );
};

export default TodoInput;
