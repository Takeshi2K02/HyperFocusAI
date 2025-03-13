import { useParams } from "react-router-dom";
import Chatbot from "../components/Chatbot";
import ChatSidebar from "../components/ChatSidebar";

const ChatPage = () => {
  const { chatId } = useParams(); // ✅ Extract chat ID from URL

  return (
    <div style={{ display: "flex" }}>
      <ChatSidebar userId="temp_123456" />
      <Chatbot chatId={chatId} />
    </div>
  );
};

export default ChatPage;