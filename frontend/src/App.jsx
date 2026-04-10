import { useEffect, useState } from "react";
import "./App.css";
import { useMemo } from "react";
import Navbar from "./components/Navbar";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import { API } from "./API";
// import { parseSync } from "vite";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [category, setCategory] = useState("general");
  const [fetchloading, setfetchLoading] = useState(false);
  const [addloading, setaddLoading] = useState(false);
  const [deleteloading, setdeleteLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const categories = ["all", ...new Set(todos.map((t) => t.category || ""))];
  const [error, setError] = useState({
    todo: false,
    category: false,
  });
  const [apiError, setApiError] = useState("");

  const addTodo = async () => {
    setaddLoading(true);
    setApiError("");

    let hasError = false;

    if (todo.trim() === "") {
      setError((prev) => ({ ...prev, todo: true }));
      hasError = true;
    }

    if (category.trim() === "") {
      setError((prev) => ({ ...prev, category: true }));
      hasError = true;
    }

    if (hasError) {
      setaddLoading(false);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      if (!token) {
        // guest
        const newTodo = {
          _id: Date.now(),
          text: todo,
          completed: false,
          category: category.toLowerCase(),
        };

        const guestTodos = JSON.parse(localStorage.getItem("guestTodos")) || [];

        const updated = [...guestTodos, newTodo];

        localStorage.setItem("guestTodos", JSON.stringify(updated));

        setTodos(updated);
        setTodo("");
        setCategory("general");

        setError({ todo: false, category: false });
        return;
      }

      const res = await API.post("/api/todos", {
        //login
        text: todo,
        completed: false,
        category: category.toLowerCase(),
      });

      setTodos([...todos, res.data]);
      setTodo("");
      setCategory("general");

      setError({ todo: false, category: false });
    } catch (err) {
      setApiError("Failed to add todo");
    } finally {
      setaddLoading(false);
    }
  };
  const toggleTodo = async (id, currentStatus) => {
    const token = localStorage.getItem("token");

    try {
      if (!token) {
        //guest
        const guestTodos = JSON.parse(localStorage.getItem("guestTodos")) || [];

        const updated = guestTodos.map((t) =>
          t._id === id ? { ...t, completed: !currentStatus } : t,
        );

        localStorage.setItem("guestTodos", JSON.stringify(updated));
        setTodos(updated);
        return;
      }

      const res = await API.put(`/api/todos/${id}`, {
        //login
        completed: !currentStatus,
      });

      setTodos(todos.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.log("Toggle failed");
    }
  };
  const deleteTodo = async (id) => {
    setdeleteLoading(true);
    setApiError("");

    const token = localStorage.getItem("token");

    try {
      if (!token) {
        // guest
        const guestTodos = JSON.parse(localStorage.getItem("guestTodos")) || [];

        const updated = guestTodos.filter((todo) => todo._id !== id);

        localStorage.setItem("guestTodos", JSON.stringify(updated));
        setTodos(updated);
        return;
      }

      await API.delete(`/api/todos/${id}`); //login
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      setApiError("Failed to delete todo");
    } finally {
      setdeleteLoading(false);
    }
  };
  useEffect(() => {
    getTodo();
  }, []);

  // Fetching todo
  const getTodo = async () => {
    setfetchLoading(true);
    setApiError("");

    const token = localStorage.getItem("token");

    try {
      if (!token) {
        //guest
        const guestTodos = JSON.parse(localStorage.getItem("guestTodos")) || [];

        setTodos(guestTodos);
        return;
      }

      const res = await API.get("/api/todos"); // login
      setTodos(res.data.data || res.data);
    } catch (err) {
      setApiError("Failed to load Todo");
    } finally {
      setfetchLoading(false);
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
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
           
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
                        onChange={(e) => {
                          setSearch(e.target.value);
                        }}
                        className="searchInput"
                        type="text"
                        placeholder="Search task"
                      />
                      <button onClick={() => setFilter("all")}>All</button>
                      <button onClick={() => setFilter("active")}>
                        Active
                      </button>
                      <button onClick={() => setFilter("completed")}>
                        Completed
                      </button>
                    </div>

                    <div className="todo-section">
                      {fetchloading && <p>Fetching todos...</p>}
                      {deleteloading && <p>Deleting...</p>}
                      {apiError && <p style={{ color: "red" }}>{apiError}</p>}
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
            
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
