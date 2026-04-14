import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("guestTodos"); 
     window.location.reload();
  };
  const isLoggedIn = !!localStorage.getItem("token");
  return (
    <nav className="navbar">
      <div className="logo">TaskFlow</div>

      <ul className="menu">
        <li onClick={() => navigate("/")}>Home</li>
        <li>My Tasks</li>
        <li>Analytics</li>
      </ul>

      <div className="nav-actions">
        {!isLoggedIn ? (
          <button onClick={() => navigate("/login")}>Login</button>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
        <button onClick={() => navigate("/register")}>Sign Up</button>
        <button className="settings">⚙ Settings</button>
      </div>
    </nav>
  );
};

export default Navbar;
