import React, { useState, useRef, useEffect } from "react";
import { sendMessage } from "../services/chatService";
import { FaPaperPlane } from "react-icons/fa"; // Send button icon

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // ✅ Step 1: Add user message
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    // ✅ Step 2: Call chatbot API
    const botResponse = await sendMessage(input);
    console.log("🔍 Bot Response Received:", botResponse);

    // ✅ Step 3: Extract bot response safely
    const botMessage = botResponse?.message || "⚠️ No response from bot.";

    // ✅ Step 4: Add bot response
    setMessages((prev) => [...prev, { sender: "bot", text: botMessage }]);

    setInput(""); // Clear input field
  };

  // ✅ Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={styles.chatContainer}>
      <div style={styles.chatHeader}>Hello! How can I assist you today?</div>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={
              msg.sender === "user"
                ? styles.userMessage
                : styles.botMessage
            }
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          style={styles.input}
        />
        <button onClick={handleSendMessage} style={styles.sendButton}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}

const styles = {
  chatContainer: {
    width: "60%",
    maxWidth: "800px",
    height: "80vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  chatHeader: {
    backgroundColor: "#e3f2fd",
    padding: "12px",
    fontWeight: "bold",
    textAlign: "center",
    borderBottom: "2px solid #ccc",
  },
  chatBox: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    scrollbarWidth: "thin",
    scrollbarColor: "#b0b0b0 transparent",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007bff",
    color: "white",
    padding: "12px 18px",
    borderRadius: "20px",
    maxWidth: "70%",
    wordWrap: "break-word",
    borderTopRightRadius: "4px",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e9ecef",
    color: "black",
    padding: "12px 18px",
    borderRadius: "20px",
    maxWidth: "70%",
    wordWrap: "break-word",
    borderTopLeftRadius: "4px",
    marginTop: "5px",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    borderTop: "1px solid #ccc",
    background: "#fff",
  },
  input: {
    flex: 1,
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "20px",
    fontSize: "1rem",
    outline: "none",
    backgroundColor: "#f1f1f1",
  },
  sendButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "10px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default Chatbot;