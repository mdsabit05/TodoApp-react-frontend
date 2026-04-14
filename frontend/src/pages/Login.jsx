import { useState } from "react";
import { API } from "../API";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";



function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    window.location.href = "/";
  }
}, []);

  const login = async () => {
    try {
      setLoading(true);
      const res = await API.post("/api/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);
       localStorage.removeItem("guestTodos"); 

      window.location.href = "/";
       
    } catch (err) {
      alert("Login failed ❌");
    } finally {
      setLoading(false)
    }

   
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
       <button onClick={login} style={styles.button} disabled={loading}>
  {loading ? "Logging in..." : "Login"}
</button>
         <p>
          Don't have account?{" "}
          <span style={styles.span} onClick={() => navigate("/Register")}>Register</span>
        </p>
      </div>
    </div>
  );
}

export default Login;



const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
   background: "#0f172a"
  },
  card: {
    background: "#1e293b",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  title: {
    textAlign: "center",

  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#4CAF50",
    color: "#fff",
    cursor: "pointer",
  },
  span: {
    color: "#3b82f6",
  cursor: "pointer"
  }
};