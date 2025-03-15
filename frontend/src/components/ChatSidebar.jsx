import React, { useEffect, useState } from "react";
import { fetchUserChats, renameChat, deleteChat } from "../services/chatService";
import { useNavigate } from "react-router-dom";
import { useChat } from "../context/ChatContext";  // ✅ Import Context

const ChatSidebar = () => {
  const { chatId, setChatId, chats, setChats, userId } = useChat();  // ✅ Use Context for userId
  const navigate = useNavigate();
  const [editingChatId, setEditingChatId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    const getChats = async () => {
      if (!userId) return;  // ✅ Ensure userId is available before making API call
      const chatData = await fetchUserChats(userId);
      if (Array.isArray(chatData)) {
        setChats(chatData);  // ✅ Store chats in context
      } else {
        setChats([]);
      }
    };

    getChats();
  }, [userId, setChats]);

  // ✅ Handle Chat Selection
  const handleChatClick = (chatId) => {
    setChatId(chatId);
    navigate(`/chat/${chatId}`);
  };

  // ✅ Handle Renaming a Chat
  const handleRename = async (chatId) => {
    if (!newTitle.trim()) return;

    const updatedChat = await renameChat(chatId, newTitle);
    if (updatedChat) {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.chat_id === chatId ? { ...chat, title: newTitle } : chat
        )
      );
    }
    setEditingChatId(null);
    setNewTitle("");
  };

  const handleDelete = async (chatId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this chat?");
    if (!confirmDelete) return;

    const success = await deleteChat(chatId);
    if (success) {
        setChats((prevChats) => prevChats.filter((chat) => chat.chat_id !== chatId));

        // ✅ If the deleted chat is the active one, reset chatId and navigate
        if (chatId === chatId) {
            setChatId(null);
            navigate("/chat");  // ✅ Redirect to a new chat
        }
    }
};


  return (
    <div style={styles.sidebar}>
      <h3>Chat History</h3>
      {chats.length > 0 ? (
        <ul style={styles.chatList}>
          {chats.map((chat) => (
            <li key={chat.chat_id} style={styles.chatItem}>
              {editingChatId === chat.chat_id ? (
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onBlur={() => handleRename(chat.chat_id)}
                  onKeyPress={(e) => e.key === "Enter" && handleRename(chat.chat_id)}
                  autoFocus
                  style={styles.input}
                />
              ) : (
                <span onClick={() => handleChatClick(chat.chat_id)}>
                  {chat.title || "Untitled Chat"}
                </span>
              )}

              {/* ✅ Rename Button */}
              <button style={styles.editButton} onClick={() => {
                setEditingChatId(chat.chat_id);
                setNewTitle(chat.title);
              }}>✏️</button>

              {/* ✅ Delete Button */}
              <button style={styles.deleteButton} onClick={() => handleDelete(chat.chat_id)}>🗑️</button>
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
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#ffffff",
    transition: "background 0.3s",
  },
  input: {
    width: "70%",
    padding: "5px",
    fontSize: "14px",
  },
  editButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    marginLeft: "5px",
  },
  deleteButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    marginLeft: "5px",
    color: "red",
  },
};

export default ChatSidebar;