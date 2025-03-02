import React, { useState } from "react";
import { sendMessage } from "../services/chatService";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (!input.trim()) return;
  
    // ✅ Step 1: Show user message in chat
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
  
    // ✅ Step 2: Call the API
    const botResponse = await sendMessage(input);
  
    console.log("🔍 Bot Response Received:", botResponse);  // ✅ Log API response
  
    // ✅ Step 3: Extract message safely
    const botMessage = botResponse?.message || "⚠️ No response from bot.";
  
    // ✅ Step 4: Add bot message to chat
    setMessages((prev) => [...prev, { sender: "bot", text: botMessage }]);
  
    setInput("");  // Clear input field
  };    

  return (
    <div style={styles.chatContainer}>
      <h3>🤖 HyperFocus AI Chatbot</h3>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={msg.sender === "user" ? styles.userMessage : styles.botMessage}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me something..."
          style={styles.input}
        />
        <button onClick={handleSendMessage} style={styles.sendButton}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  chatContainer: {
    width: "350px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#fff",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
  },
  chatBox: {
    height: "250px",
    overflowY: "auto",
    padding: "10px",
    borderBottom: "1px solid #ccc",
  },
  userMessage: {
    textAlign: "right",
    background: "#d1e7ff",
    padding: "8px",
    borderRadius: "8px",
    marginBottom: "5px",
    maxWidth: "70%",
    marginLeft: "auto",
  },
  botMessage: {
    textAlign: "left",
    background: "#f1f1f1",
    padding: "8px",
    borderRadius: "8px",
    marginBottom: "5px",
    maxWidth: "70%",
  },
  inputContainer: {
    display: "flex",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "8px",
    border: "1px solid #ccc",
  },
  sendButton: {
    background: "#007bff",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
  },
};

export default Chatbot;