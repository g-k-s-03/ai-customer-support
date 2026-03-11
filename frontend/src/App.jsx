import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Documents from "./pages/Documents";
import Chat from "./pages/Chat";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [page, setPage] = useState("login");

  useEffect(() => {
    if (token) setPage("documents");
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setPage("login");
  };

  if (!token) {
    return page === "login"
      ? <Login setToken={setToken} goToRegister={() => setPage("register")} />
      : <Register goToLogin={() => setPage("login")} />;
  }

  return (
    <div>
      <nav style={{ padding: "1rem 2rem", background: "#1e1e2e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ color: "#cdd6f4", margin: 0 }}>🤖 AI Support</h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={() => setPage("documents")} style={navBtn}>Documents</button>
          <button onClick={() => setPage("chat")} style={navBtn}>Chat</button>
          <button onClick={logout} style={{ ...navBtn, background: "#f38ba8", color: "#1e1e2e" }}>Logout</button>
        </div>
      </nav>
      {page === "documents" ? <Documents token={token} /> : <Chat token={token} />}
    </div>
  );
}

const navBtn = {
  padding: "0.5rem 1rem",
  background: "#313244",
  color: "#cdd6f4",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.9rem"
};