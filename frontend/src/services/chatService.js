import axios from "axios";

const CHAT_API_URL = "http://localhost:5000/chat";

// ✅ Fetch all chats for a user
export const fetchUserChats = async (userId) => {
  try {
    console.log("📡 Fetching chat titles for user:", userId);
    const response = await axios.get(`${CHAT_API_URL}/${userId}`);
    console.log("🛠️ Chat Titles Response:", response.data);
    return response.data.chats || []; // ✅ Ensure it always returns an array
  } catch (error) {
    console.error("❌ Error fetching chat history:", error);
    return [];
  }
};

// ✅ Fetch messages for a specific chat
export const fetchChatMessages = async (chatId) => {
  if (!chatId || chatId === "undefined") {
    console.warn("⚠️ Skipping API call: No valid chat ID.");
    return []; // ✅ Prevent API call with undefined ID
  }

  try {
    console.log("📡 Fetching messages for chat:", chatId);
    const response = await axios.get(`${CHAT_API_URL}/messages/${chatId}`);
    console.log("📥 API Response:", response.data.messages);
    return response.data.messages || [];
  } catch (error) {
    console.error("❌ Error fetching chat messages:", error);
    return [];
  }
};

// ✅ Send a message to an existing chat (or create new chat)
export const sendMessage = async (chatId, role, message) => {
  try {
    const payload = {
      chat_id: chatId, // Can be null for a new chat
      user_id: "temp_123456", // ✅ Placeholder for user ID (until authentication is implemented)
      role,
      content: message
    };

    console.log("📤 Sending message:", payload);

    const response = await axios.post(`${CHAT_API_URL}/message`, payload);
    console.log("🛠️ API Response:", response.data);

    return response.data; // ✅ Returns { chat_id, message_id, message }
  } catch (error) {
    console.error("❌ Error sending message:", error);
    return { message: "⚠️ Failed to send message." };
  }
};

// ✅ Delete a chat session
export const deleteChat = async (chatId) => {
  try {
    console.log("🗑️ Deleting chat:", chatId);
    await axios.delete(`${CHAT_API_URL}/${chatId}`);
    console.log("✅ Chat deleted successfully.");
    return true;
  } catch (error) {
    console.error("❌ Error deleting chat:", error);
    return false;
  }
};