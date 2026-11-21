import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return "TS";
    return name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="logo">
          <span className="logo-mark"></span>
          <span>
            TALENTSPHERE <span className="accent">AI</span>
          </span>
        </Link>

        <button
          className="nav-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
        >
          {open ? "✕" : "☰"}
        </button>

        <div className={`nav-menu ${open ? "open" : ""}`} onClick={() => setOpen(false)}>
          <nav className="nav-links">
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              Home
            </NavLink>
            <NavLink to="/jobs" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              Browse Jobs
            </NavLink>

            {isLoggedIn && user?.role === "CANDIDATE" && (
              <>
                <NavLink to="/candidate" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  Dashboard
                </NavLink>
                <NavLink to="/candidate/resume" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  Resume
                </NavLink>
                <NavLink to="/candidate/improve" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  Improve
                </NavLink>
                <NavLink to="/candidate/applications" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  Applications
                </NavLink>
                <NavLink to="/candidate/profile" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  Profile
                </NavLink>
              </>
            )}

            {isLoggedIn && user?.role === "RECRUITER" && (
              <>
                <NavLink to="/recruiter" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  Analytics
                </NavLink>
                <NavLink to="/recruiter/post" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  + Post Job
                </NavLink>
                <NavLink to="/recruiter/jobs" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  My Jobs
                </NavLink>
              </>
            )}
          </nav>

          <div className="nav-actions">
            {isLoggedIn ? (
              <div className="nav-profile-wrap">
                <div className="nav-profile">
                  <span className="avatar">{getInitials(user?.name)}</span>
                  <div className="user-info">
                    <span className="user-name">{user?.name || "User"}</span>
                    <span className="role-tag">{user?.role}</span>
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="nav-auth-buttons">
                <Link to="/login" className="btn btn-ghost btn-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
