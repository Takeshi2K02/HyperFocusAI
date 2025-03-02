import axios from "axios";

const CHAT_API_URL = "http://localhost:5000/api/chat"; // Adjust if necessary

// Send message to chatbot
export const sendMessage = async (message) => {
  try {
    const response = await axios.post(CHAT_API_URL, { message });
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    return { response: "Failed to fetch response" };
  }
};