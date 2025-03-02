import React from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

function TaskPage() {
  return (
    <div style={styles.container}>
      <h1>📋 Task Management</h1>
      <TaskForm />
      <TaskList />
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

export default TaskPage;
