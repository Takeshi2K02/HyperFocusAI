import React from "react";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import Chatbot from "./components/Chatbot";  // Import chatbot

function App() {
  return (
    <div style={styles.container}>
      <h1>🚀 HyperFocus AI</h1>
      <TaskForm />
      <TaskList />
      <Chatbot />  {/* ✅ Add Chatbot Component */}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
};

export default App;