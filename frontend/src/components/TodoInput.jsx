import React from "react";

const TodoInput = ({
  todo,
  setTodo,
  addTodo,
  category,
  setCategory,
  error,
  addLoading
}) => {
  return (
    <div className="todo-input">
      <input
        type="text"
        placeholder="Add a new task..."
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && todo.trim() !== "") {
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
         onKeyDown={(e) => {
          if (e.key === "Enter" && todo.trim() !== "") {
            addTodo();
          }
        }}
      />

      <button onClick={addTodo} disabled={addLoading}> 
  {addLoading ? "Adding..." : "Add"}
</button>
    </div>
  );
};

export default TodoInput;
