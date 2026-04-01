import { useState } from "react";
import axios from "axios";

export default function Register({ goToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, { email, password });
      setSuccess("Account created! Please login.");
      setError("");
    } catch (err) {
      setError("Registration failed. Email may already exist.");
      setSuccess("");
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={title}>🤖 AI Support</h2>
        <p style={subtitle}>Create an account</p>
        {error && <p style={errorStyle}>{error}</p>}
        {success && <p style={successStyle}>{success}</p>}
        <input style={input} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={input} placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button style={btn} onClick={handleRegister}>Register</button>
        <p style={link} onClick={goToLogin}>Already have an account? Login</p>
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
const successStyle = { color: "#a6e3a1", textAlign: "center", margin: 0 };
const link = { color: "#89b4fa", textAlign: "center", cursor: "pointer", margin: 0 };
