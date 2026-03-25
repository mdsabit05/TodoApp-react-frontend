import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import { API } from "./API";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [category, setCategory] = useState("general");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const categories = [
    "all",
    ...new Set(todos.map((t) => t.category || "general")),
  ];
  const [error, setError] = useState({
    todo: false,
    category: false,
  });

  // const addTodo = async () => {
  //   if (todo.trim() === "" || category.trim() === "") return;

  //   try {
  //     const res = await API.post("/api/todos", {
  //       text: todo,
  //       completed: false,
  //       category: category.toLowerCase(),
  //     });

  //     setTodos([...todos, res.data]);
  //     setTodo("");
  //     setCategory("general");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  const addTodo = async () => {
    let hasError = false;

    if (todo.trim() === "") {
      setError((prev) => ({ ...prev, todo: true }));
      hasError = true;
    }

    if (category.trim() === "") {
      setError((prev) => ({ ...prev, category: true }));
      hasError = true;
    }

    if (hasError) return;

    try {
      const res = await API.post("/api/todos", {
        text: todo,
        completed: false,
        category: category.toLowerCase(),
      });

      setTodos([...todos, res.data]);
      setTodo("");
      setCategory("");

      // reset error
      setError({ todo: false, category: false });
    } catch (err) {
      console.log(err);
    }
  };
  const toggleTodo = (index) => {
    const updtaeTodo = todos.map((todo, i) => {
      if (index == i) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(updtaeTodo);
  };
  const deleteTodo = async (id) => {
    try {
      await API.delete(`/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getTodo();
  }, []);

  // Fetching todo
  const getTodo = async () => {
    try {
      const res = await API.get("/api/todos");
      setTodos(res.data.data || res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const showTodo = todos.filter((todo) => {
    const filterTodo = () => {
      if (filter === "completed") return todo.completed;
      if (filter === "active") return !todo.completed;
      return true;
    };

    const categoryCheck =
      categoryFilter === "all" || todo.category === categoryFilter;

    const searchCheck =
      todo.text.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (todo.category || "")
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());

    return filterTodo() && categoryCheck && searchCheck;
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <>
      <div className="app">
        <Navbar />
        <main className="container">
          <h1>My Todo List</h1>
          <TodoInput
            todo={todo}
            setTodo={setTodo}
            addTodo={addTodo}
            category={category}
            setCategory={setCategory}
            error={error}
          />
          <div className="filters">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="searchInput"
              type="text"
              placeholder="Search task"
            />
            <button onClick={() => setFilter("all")}>All</button>
            <button onClick={() => setFilter("active")}>Active</button>
            <button onClick={() => setFilter("completed")}>Completed</button>
          </div>
          <div className="todo-section">
            <select
              className="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
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
    </>
  );
}

export default App;
