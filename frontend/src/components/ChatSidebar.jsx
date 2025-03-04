import React, { useState, useEffect } from "react";
import { fetchUserChats } from "../services/chatService";
import { useNavigate } from "react-router-dom";

function ChatSidebar({ userId }) {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadChats = async () => {
      const chatHistory = await fetchUserChats(userId);
      setChats(chatHistory);
    };
    loadChats();
  }, [userId]);

  return (
    <div style={{ width: "250px", height: "100vh", backgroundColor: "#f8f9fa", padding: "10px" }}>
      <h3>Chat History</h3>
      {chats.map((chat) => (
        <div key={chat._id} onClick={() => navigate(`/chat/${chat._id}`)}>{chat.title}</div>
      ))}
    </div>
  );
}

export default ChatSidebar;
