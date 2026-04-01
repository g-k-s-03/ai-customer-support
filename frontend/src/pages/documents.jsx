import { useState, useEffect } from "react";
import axios from "axios";

export default function Documents({ token }) {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchDocuments = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/documents/`, { headers });
    setDocuments(res.data);
  };

  useEffect(() => { fetchDocuments(); }, []);

  const handleUpload = async () => {
    if (!file) { setMessage("Please select a file first."); return; }
    const formData = new FormData();
    formData.append("file", file);
    try {
      setMessage("Uploading...");
      await axios.post(`${import.meta.env.VITE_API_URL}/documents/upload`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      setMessage("File uploaded successfully!");
      setFile(null);
      fetchDocuments();
    } catch (err) {
      setMessage("Upload failed. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/documents/${id}`, { headers });
    fetchDocuments();
  };

  return (
    <div style={{ padding: "2rem", background: "#1e1e2e", minHeight: "calc(100vh - 60px)" }}>
      <h2 style={{ color: "#cdd6f4" }}>📄 Documents</h2>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", alignItems: "center" }}>
        <label style={{ padding: "0.6rem 1.2rem", background: "#89b4fa", color: "#1e1e2e", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
          📁 Choose File
          <input type="file" accept=".txt,.pdf" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />
        </label>
        {file && <span style={{ color: "#cdd6f4" }}>{file.name}</span>}
        {file && <button style={{ padding: "0.6rem 1.2rem", background: "#a6e3a1", color: "#1e1e2e", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }} onClick={handleUpload}>Upload</button>}
      </div>
      {message && <p style={{ color: "#a6e3a1" }}>{message}</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {documents.length === 0 && <p style={{ color: "#a6adc8" }}>No documents uploaded yet.</p>}
        {documents.map(doc => (
          <div key={doc.id} style={{ background: "#313244", padding: "1rem 1.5rem", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#cdd6f4" }}>📎 {doc.filename}</span>
            <button style={{ padding: "0.4rem 0.8rem", background: "#f38ba8", color: "#1e1e2e", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }} onClick={() => handleDelete(doc.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
