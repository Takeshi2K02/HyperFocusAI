import React from "react";
import Chatbot from "../components/Chatbot";
import ChatSidebar from "../components/ChatSidebar";
import { useParams } from "react-router-dom";

function ChatPage() {
  const { chatId } = useParams();  // ✅ Get chatId from URL correctly
  const userId = "temp_123456";  // Temporary user ID

  console.log("🌐 ChatPage URL chatId:", chatId);

  return (
    <div style={styles.container}>
      <ChatSidebar userId={userId} />
      <Chatbot chatId={chatId} userId={userId} />  {/* ✅ Ensure chatId is passed */}
    </div>
  );
}

// ✅ Page Layout Styles
const styles = {
  container: {
    display: "flex",
    height: "100vh",
  },
};

export default ChatPage;