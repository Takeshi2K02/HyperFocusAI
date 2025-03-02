import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TaskPage from "./pages/TaskPage";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tasks" element={<TaskPage />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

function HomePage() {
  return (
    <div style={styles.homeContainer}>
      <h1>🚀 Welcome to HyperFocus AI</h1>
      <p>Your AI-powered productivity assistant.</p>
      <div style={styles.buttonContainer}>
        <Link to="/tasks">
          <button style={styles.button}>📋 Manage Tasks</button>
        </Link>
        <Link to="/chats">
          <button style={styles.button}>💬 Open Chatbot</button>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  homeContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center",
  },
  buttonContainer: {
    display: "flex",
    gap: "20px",
    marginTop: "20px",
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
};

export default App;