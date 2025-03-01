import React from "react";

function App() {
  return (
    <div style={styles.container}>
      <h1>🚀 Welcome to HyperFocus AI</h1>
      <p>Your AI-powered productivity assistant is up and running!</p>
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