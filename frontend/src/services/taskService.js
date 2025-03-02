import axios from "axios";

const API_URL = "http://localhost:5000/tasks";
// Get all tasks
export const getTasks = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

// Add a new task
export const addTask = async (task) => {
  try {
    const response = await axios.post(API_URL, task);
    return response.data;
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    await axios.delete(`${API_URL}/${taskId}`);
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

export const sendMessage = async (message) => {
  try {
    const response = await axios.post("http://localhost:5000/chat", { message });

    console.log("✅ Chatbot API Raw Response:", response.data);  // ✅ Debugging log

    return response.data;  // Ensure we return the API response correctly
  } catch (error) {
    console.error("❌ Error sending message:", error);
    return { response: "⚠️ Failed to fetch chatbot response." };
  }
};