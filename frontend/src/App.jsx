import { useEffect, useState , useCallback } from "react";
import "./App.css";
import { useMemo } from "react";
import Navbar from "./components/Navbar";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import { API } from "./API";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Home from "./pages/Home";
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
  const categories = [
    "all",
    ...new Set(todos.filter(Boolean).map((t) => t.category || "")),
  ];
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


  const toggleTodo = async (id, checked) => {


    try {
      const res = await API.put(`/api/todos/${id}/toggle`, {
        completed: checked,
      });
setTodos((prev) =>
  prev.map((t) =>
    t._id === id
      ? {
          ...res.data,
          completed: !!res.data.completed_at  
        }
      : t
  )
);
    } catch (err) {
      console.log("Toggle failed:", err.response?.data || err.message);
    }
  };
  const deleteTodo = async (id) => {
    setdeleteLoading(true);
    setApiError("");

    const token = localStorage.getItem("token");

    try {

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
      const res = await API.get("/api/todos");

const normalized = (res.data.data || res.data).map((t) => ({
  ...t,
  completed: !!t.completed_at  
}));

setTodos(normalized);
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
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
         <Route
  path="/"
  element={
    <PrivateRoute>
      <>
        <Navbar />
        <Home
          todo={todo}
          setTodo={setTodo}
          addTodo={addTodo}
          category={category}
          setCategory={setCategory}
          error={error}
          addloading={addloading}
          search={search}
          setSearch={setSearch}
          setFilter={setFilter}
          fetchloading={fetchloading}
          deleteloading={deleteloading}
          apiError={apiError}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categories={categories}
          showTodo={showTodo}
          deleteTodo={deleteTodo}
          toggleTodo={toggleTodo}
        />
      </>
    </PrivateRoute>
  }
/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
