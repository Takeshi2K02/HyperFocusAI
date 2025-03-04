import axios from "axios";

const CHAT_API_URL = "http://localhost:5000/chat";  // Ensure this matches your backend

// ✅ Retrieve an existing chat or create a new one if none exists
export const getOrCreateChat = async (userId, title = "New Chat") => {
  try {
    const response = await axios.post(`${CHAT_API_URL}/new`, { user_id: userId, title });
    return response.data.chat_id;  // Return the chat ID
  } catch (error) {
    console.error("❌ Error creating or retrieving chat:", error);
    return null;
  }
};

// ✅ Send a message to an existing chat and get a response
export const sendMessage = async (chatId, role, message) => {
  try {
    // Step 1️⃣: Store the user message
    await axios.post(`${CHAT_API_URL}/${chatId}/message`, {
      role,
      content: message
    });

    // Step 2️⃣: Ask the AI chatbot for a response
    const response = await axios.post(`${CHAT_API_URL}`, { message });

    return response.data;  // Return the actual chatbot response
  } catch (error) {
    console.error("❌ Error sending message:", error);
    return { message: "⚠️ Failed to get chatbot response." };
  }
};

// ✅ Fetch all chats for a user
export const fetchUserChats = async (userId) => {
  try {
    const response = await axios.get(`${CHAT_API_URL}/history/${userId}`);
    return response.data.chats;  // Returns an array of chats
  } catch (error) {
    console.error("❌ Error fetching chat history:", error);
    return [];
  }
};

// ✅ Fetch messages for a specific chat
export const fetchChatMessages = async (chatId) => {
  try {
    const response = await axios.get(`${CHAT_API_URL}/${chatId}/messages`);
    return response.data.messages;
  } catch (error) {
    console.error("❌ Error fetching chat messages:", error);
    return [];
  }
};