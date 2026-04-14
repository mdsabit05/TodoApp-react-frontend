import React from "react";
import TodoInput from "../components/TodoInput";
import TodoList from "../components/TodoList";

const Home = ({
  todo, setTodo, addTodo,
  category, setCategory,
  error, addloading,
  search, setSearch,
  setFilter,
  categoryFilter, setCategoryFilter,
  categories,
  showTodo,
  deleteTodo, toggleTodo
}) => {
  return (
    <div className="app">
      <main className="container">
        <h1>My Todo List</h1>

        <TodoInput
          todo={todo}
          setTodo={setTodo}
          addTodo={addTodo}
          category={category}
          setCategory={setCategory}
          error={error}
          addLoading={addloading}
        />

        <div className="filters">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="searchInput"
          />
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("active")}>Active</button>
          <button onClick={() => setFilter("completed")}>Completed</button>
        </div>

        <div className="todo-section">
          <select className="category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((cat, i) => (
              <option key={i}>{cat}</option>
            ))}
          </select>

          <TodoList
            todos={showTodo}
            deleteTodo={deleteTodo}
            toggleTodo={toggleTodo}
          />
        </div>
      </main>
    </div>
  );
};

export default Home;