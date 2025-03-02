import React, { useState } from "react";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";

function App() {
  const [refresh, setRefresh] = useState(false);

  const refreshTasks = () => {
    setRefresh((prev) => !prev); // Toggle state to trigger re-render
  };

  return (
    <div style={styles.container}>
      <h1>🚀 HyperFocus AI - Task Manager</h1>
      <TaskForm refreshTasks={refreshTasks} />
      <TaskList key={refresh} />
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