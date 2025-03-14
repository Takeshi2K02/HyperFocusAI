import { createContext, useContext, useState, useEffect } from "react";

// ✅ Create Chat Context
const ChatContext = createContext();

// ✅ Chat Provider Component
export const ChatProvider = ({ children, initialUserId }) => {
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [userId, setUserId] = useState(initialUserId || null);  // ✅ Accept initial userId

  useEffect(() => {
    if (initialUserId) {
      setUserId(initialUserId);
    }
  }, [initialUserId]);

  return (
    <ChatContext.Provider value={{ messages, setMessages, chatId, setChatId, chats, setChats, userId, setUserId }}>
      {children}
    </ChatContext.Provider>
  );
};

// ✅ Custom Hook to use Chat Context
export const useChat = () => {
  return useContext(ChatContext);
};