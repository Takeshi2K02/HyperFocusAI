import React, { useState } from "react";
import { addTask } from "../services/taskService";

function TaskForm({ refreshTasks }) {
  const [task, setTask] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (task.trim() === "") return;

    await addTask({ title: task });
    setTask("");
    refreshTasks(); // Refresh task list
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        placeholder="Enter a task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        style={styles.input}
      />
      <button type="submit" style={styles.addButton}>➕ Add Task</button>
    </form>
  );
}

const styles = {
  form: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    width: "250px",
    border: "1px solid #ccc",
  },
  addButton: {
    background: "green",
    color: "white",
    border: "none",
    cursor: "pointer",
    padding: "10px",
  },
};

export default TaskForm;