import { useState } from "react";
import axios from "axios";

export default function Chat({ token }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const headers = { Authorization: `Bearer ${token}` };

  const handleAsk = async () => {
    if (!question.trim()) return;
    const userMessage = question;
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setQuestion("");
    setLoading(true);
    try {
      const body = { question: userMessage };
      if (sessionId) body.session_id = sessionId;

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/chat/ask`, body, { headers });
      setSessionId(res.data.session_id);
      setMessages(prev => [...prev, { role: "ai", content: res.data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", content: "Something went wrong. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <div style={container}>
      <h2 style={title}>💬 Chat</h2>
      <div style={chatBox}>
        {messages.length === 0 && <p style={empty}>Ask a question about your uploaded documents.</p>}
        {messages.map((msg, i) => (
          <div key={i} style={msg.role === "user" ? userMsg : aiMsg}>
            <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.content}
          </div>
        ))}
        {loading && <div style={aiMsg}><strong>AI:</strong> Thinking...</div>}
      </div>
      <div style={inputBox}>
        <input
          style={input}
          placeholder="Ask a question..."
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAsk()}
        />
        <button style={btn} onClick={handleAsk}>Send</button>
      </div>
    </div>
  );
}

const container = { padding: "2rem", maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", height: "85vh" };
const title = { color: "#cdd6f4" };
const chatBox = { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1rem", padding: "1rem", background: "#181825", borderRadius: "8px" };
const empty = { color: "#a6adc8", textAlign: "center" };
const userMsg = { background: "#313244", padding: "0.75rem 1rem", borderRadius: "8px", color: "#cdd6f4", alignSelf: "flex-end", maxWidth: "70%" };
const aiMsg = { background: "#1e1e2e", padding: "0.75rem 1rem", borderRadius: "8px", color: "#cdd6f4", alignSelf: "flex-start", maxWidth: "70%", border: "1px solid #45475a" };
const inputBox = { display: "flex", gap: "1rem" };
const input = { flex: 1, padding: "0.75rem", borderRadius: "6px", border: "1px solid #45475a", background: "#313244", color: "#cdd6f4", fontSize: "1rem" };
const btn = { padding: "0.75rem 1.5rem", background: "#89b4fa", color: "#1e1e2e", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" };
