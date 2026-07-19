import { useState } from "react";

export default function Navbar({ user, onLogout, onNavigate }) {
  const [open, setOpen] = useState(false);

  const goto = (page) => {
    onNavigate(page);
    setOpen(false);
  };

  return (
    <nav className="app-nav">
      <div className="nav-left">
        <div className="logo">GI</div>
        <div className="brand">Green Idea</div>
      </div>

      <button
        className="nav-toggle"
        aria-label="Toggle menu"
        onClick={() => setOpen((s) => !s)}
      >
        <span className="hamburger" />
      </button>

      <div className={`nav-links ${open ? "open" : ""}`}>
        <button onClick={() => goto("dashboard")}>Dashboard</button>
        <button onClick={() => goto("agriculture")}>Agriculture</button>
        <button onClick={() => goto("services")}>Services</button>
        {user ? (
          <button onClick={() => { onLogout(); setOpen(false); }}>Logout</button>
        ) : (
          <button onClick={() => goto("login")}>Login</button>
        )}
      </div>
    </nav>
  );
}
