import React from 'react'

const Navbar = () => {
  return (
       <nav className="navbar">
          <div className="logo">TaskFlow</div>

          <ul className="menu">
            <li>Home</li>
            <li>My Tasks</li>
            <li>Analytics</li>
          </ul>

          <div className="nav-actions">
            <button className="settings">⚙ Settings</button>
            <button className="signup">Sign Up</button>
          </div>
        </nav>
  )
}

export default Navbar