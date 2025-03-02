import axios from "axios";

const CHAT_API_URL = "http://localhost:5000/chat"; // Ensure this matches your backend route

export const sendMessage = async (message) => {
  try {
    const response = await axios.post("http://localhost:5000/chat", { message });

    console.log("✅ Chatbot API Raw Response:", response.data);  // ✅ Log response for debugging

    return response.data;  // Ensure we return exactly what the backend sends
  } catch (error) {
    console.error("❌ Error sending message:", error);
    return { message: "⚠️ Failed to fetch chatbot response." };
  }
};