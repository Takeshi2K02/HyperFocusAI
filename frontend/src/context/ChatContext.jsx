import { createContext, useContext, useState } from "react";

// ✅ Create Chat Context
const ChatContext = createContext();

// ✅ Chat Provider Component
export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);

  return (
    <ChatContext.Provider value={{ messages, setMessages, chatId, setChatId }}>
      {children}
    </ChatContext.Provider>
  );
};

// ✅ Custom Hook to use Chat Context
export const useChat = () => {
  return useContext(ChatContext);
};