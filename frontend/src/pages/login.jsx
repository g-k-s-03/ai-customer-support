import { useState } from "react";
import axios from "axios";

export default function Login({ setToken, goToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
      localStorage.setItem("token", res.data.access_token);
      setToken(res.data.access_token);
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={title}>🤖 AI Support</h2>
        <p style={subtitle}>Sign in to your account</p>
        {error && <p style={errorStyle}>{error}</p>}
        <input style={input} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={input} placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button style={btn} onClick={handleLogin}>Login</button>
        <p style={link} onClick={goToRegister}>Don't have an account? Register</p>
      </div>
    </div>
  );
}

const container = { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#1e1e2e" };
const card = { background: "#313244", padding: "2.5rem", borderRadius: "12px", width: "360px", display: "flex", flexDirection: "column", gap: "1rem" };
const title = { color: "#cdd6f4", margin: 0, textAlign: "center" };
const subtitle = { color: "#a6adc8", textAlign: "center", margin: 0 };
const input = { padding: "0.75rem", borderRadius: "6px", border: "1px solid #45475a", background: "#1e1e2e", color: "#cdd6f4", fontSize: "1rem" };
const btn = { padding: "0.75rem", background: "#89b4fa", color: "#1e1e2e", border: "none", borderRadius: "6px", fontSize: "1rem", cursor: "pointer", fontWeight: "bold" };
const errorStyle = { color: "#f38ba8", textAlign: "center", margin: 0 };
const link = { color: "#89b4fa", textAlign: "center", cursor: "pointer", margin: 0 };
