import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchChatMessages, fetchUserChats , sendMessage } from "../services/chatService";
import { useChat } from "../context/ChatContext";

const Chatbot = () => {
  const { chatId: urlChatId } = useParams();
  const navigate = useNavigate();
  const { chatId, setChatId, chats, setChats, userId } = useChat();  // ✅ userId now exists
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // ✅ Sync `chatId` from URL
useEffect(() => {
  if (urlChatId && chatId !== urlChatId) {
      setChatId(urlChatId);
  }
}, [urlChatId, chatId, setChatId]);

// ✅ Redirect to a new chat when the current chat is deleted
useEffect(() => {
  if (!chatId) {
      console.log("⚠️ Active chat deleted. Redirecting to new chat...");
      navigate("/chat");  // ✅ Redirect to a new chat
  }
}, [chatId, navigate]);

// ✅ Load messages when `chatId` changes
useEffect(() => {
  if (!chatId) return;

  const loadMessages = async () => {
      console.log("📩 Fetching messages for chat:", chatId);
      const chatData = await fetchChatMessages(chatId);

      if (chatData && Array.isArray(chatData) && chatData.length > 0) {
          console.log("✅ Messages exist:", chatData.length, "messages found.");
          setMessages(chatData);
      } else {
          console.warn("⚠️ No messages found for this chat.");
          setMessages([]);
      }
  };

  loadMessages();
}, [chatId]);

// ✅ Scroll to the latest message when `messages` update
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);


  const handleSendMessage = async () => {
    if (!input.trim()) return;

    console.log("💬 Sending message:", input, "to chat:", chatId);

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
        const response = await sendMessage(chatId, "user", input);
        console.log("🛠️ API Response:", response);

        // ✅ If a new chat is created, update the context & sidebar instantly
        if (!chatId && response.chat_id) {
            console.log("🔄 New chat detected. Updating context & sidebar.");
            setChatId(response.chat_id);
            navigate(`/chat/${response.chat_id}`);
        }

        // ✅ Fetch latest messages immediately
        const updatedMessages = await fetchChatMessages(response.chat_id || chatId);
        setMessages(updatedMessages);

        // ✅ Fetch updated chat list to get AI-generated title
        if (userId) {
            console.log("🔄 Fetching updated chat list for user:", userId);
            const updatedChats = await fetchUserChats(userId);  
            setChats(updatedChats);  // ✅ Update sidebar with correct AI-generated title
        } else {
            console.warn("⚠️ userId is not defined. Skipping chat update.");
        }

    } catch (error) {
        console.error("❌ Error sending message:", error);
    }
  };


  return (
    <div style={styles.chatContainer}>
      <h2>Chat {chatId || "New Chat"}</h2>
      <div style={styles.messageContainer}>
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={msg.message_id || index}
              style={{
                ...styles.messageBubble,
                ...(msg.role === "user" ? styles.userMessage : styles.assistantMessage),
              }}
            >
              {msg.content}
            </div>
          ))
        ) : (
          <p>Loading messages...</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ✅ Input Field and Send Button */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button onClick={handleSendMessage} style={styles.sendButton}>Send</button>
      </div>
    </div>
  );
};

// ✅ Styling
const styles = {
  chatContainer: {
    flex: 1,
    padding: "20px",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  messageContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "10px",
    overflowY: "auto",
    flex: 1,
  },
  messageBubble: {
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "60%",
    wordWrap: "break-word",
    fontSize: "16px",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007bff",
    color: "white",
  },
  assistantMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f1f1",
    color: "black",
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
    borderRadius: "20px",
    fontSize: "1rem",
    backgroundColor: "#f1f1f1",
  },
  sendButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "8px",
    padding: "10px 15px",
    marginLeft: "10px",
    cursor: "pointer",
  },
};

export default Chatbot;