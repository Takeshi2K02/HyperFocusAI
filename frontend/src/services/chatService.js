import axios from "axios";

const CHAT_API_URL = "http://localhost:5000/chat";

// ✅ Fetch all chats for a user
export const fetchUserChats = async (userId) => {
  try {
    const response = await axios.get(`${CHAT_API_URL}/${userId}`);
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
    const response = await axios.get(`${CHAT_API_URL}/messages/${chatId}`);
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

    const response = await axios.post(`${CHAT_API_URL}/message`, payload);

    return response.data; // ✅ Returns { chat_id, message_id, message }
  } catch (error) {
    console.error("❌ Error sending message:", error);
    return { message: "⚠️ Failed to send message." };
  }
};

// ✅ Delete a chat session
export const deleteChat = async (chatId) => {
  try {
    await axios.delete(`${CHAT_API_URL}/${chatId}`);
    return true;
  } catch (error) {
    console.error("❌ Error deleting chat:", error);
    return false;
  }
};

// ✅ Rename a chat
export const renameChat = async (chatId, newTitle) => {
  try {
    console.log("✏️ Renaming chat:", chatId, "→", newTitle);
    
    const response = await axios.put(`${CHAT_API_URL}/rename/${chatId}`, { title: newTitle });

    console.log("✅ Chat renamed successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error renaming chat:", error);
    return null;
  }
};


// ✅ Delete a specific message
export const deleteMessage = async (messageId) => {
  try {
    const response = await axios.delete(`${CHAT_API_URL}/message/${messageId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting message:", error);
    return null;
  }
};
