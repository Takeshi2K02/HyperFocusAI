import React from "react";
import Chatbot from "../components/Chatbot";

function ChatPage() {
  return (
    <div style={styles.container}>
      <Chatbot />
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "rgb(173, 213, 255)", // Matches chatbot UI background
  },
};

export default ChatPage;