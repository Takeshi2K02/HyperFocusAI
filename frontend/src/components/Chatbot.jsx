import React, { useState, useEffect, useRef } from "react";
import { getOrCreateChat, sendMessage, fetchChatMessages } from "../services/chatService";
import { FaPaperPlane } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";

function Chatbot({ userId }) {
  const { chatId: urlChatId } = useParams();  // ✅ Get chatId from URL
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  // ✅ Ensure chatId is correctly set when visiting a previous chat
  useEffect(() => {
    console.log("🌐 URL Chat ID:", urlChatId);
    if (urlChatId && urlChatId !== "null") {
      setChatId(urlChatId);
      console.log("✅ Setting Chat ID in State:", urlChatId);
    }
  }, [urlChatId]);

  // ✅ Load messages when chatId is set
  useEffect(() => {
    if (!chatId) return;
    console.log("🔄 Loading Messages for Chat ID:", chatId);

    const loadMessages = async () => {
      const chatHistory = await fetchChatMessages(chatId);
      console.log("📜 Loaded Messages:", chatHistory);

      setMessages(chatHistory.map(msg => ({
        sender: msg.role === "user" ? "user" : "bot",
        text: msg.content
      })));
    };

    loadMessages();
  }, [chatId]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
  
    let newChatId = chatId;
  
    // ✅ Create chat only when first message is sent
    if (!chatId || chatId === "null") {
      try {
        const response = await sendMessage(null, "user", input, userId);  // ✅ Pass userId
        newChatId = response.chat_id;  // ✅ Backend returns chat_id
        setChatId(newChatId);
        navigate(`/chat/${newChatId}`, { replace: true });
      } catch (error) {
        console.error("❌ Error creating chat:", error);
        return;
      }
    }
  
    // ✅ Add message to UI
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
  
    try {
      const botResponse = await sendMessage(newChatId, "user", input);
      setMessages((prev) => [...prev, { sender: "bot", text: botResponse.message || "⚠️ No response from bot." }]);
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };   

  return (
    <div>
      <h2>{chatId ? `Chat ${chatId}` : "New Chat"}</h2>
      <div>
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index}>{msg.sender}: {msg.text}</div>
          ))
        ) : (
          <p>Start a conversation...</p>
        )}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSendMessage}><FaPaperPlane /></button>
    </div>
  );
}

export default Chatbot;