import React, { useEffect, useState } from "react";
import { fetchUserChats } from "../services/chatService";
import { useNavigate } from "react-router-dom";
import { useChat } from "../context/ChatContext";  // ✅ Import Context Hook

const ChatSidebar = ({ userId }) => {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  const { setChatId } = useChat();  // ✅ Set chat ID in global state

  useEffect(() => {
    const getChats = async () => {
      const chatData = await fetchUserChats(userId);
      if (Array.isArray(chatData)) {
        setChats(chatData);
      } else {
        setChats([]);
      }
    };

    getChats();
  }, [userId]);

  return (
    <div style={styles.sidebar}>
      <h3>Chat History</h3>
      {chats.length > 0 ? (
        <ul style={styles.chatList}>
          {chats.map((chat) => (
            <li
              key={chat.chat_id}
              style={styles.chatItem}
              onClick={() => {
                setChatId(chat.chat_id);
                navigate(`/chat/${chat.chat_id}`);
              }}
            >
              {chat.title || "Untitled Chat"}
            </li>
          ))}
        </ul>
      ) : (
        <p>No previous chats.</p>
      )}
    </div>
  );
};

const styles = {
  sidebar: {
    width: "250px",
    height: "100vh",
    padding: "15px",
    background: "#f8f9fa",
    borderRight: "1px solid #ddd",
    overflowY: "auto",
  },
  chatList: {
    listStyle: "none",
    padding: 0,
  },
  chatItem: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#ffffff",
    transition: "background 0.3s",
  },
};

export default ChatSidebar;