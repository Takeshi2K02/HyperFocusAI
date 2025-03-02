import React, { useState } from "react";
import { addTask } from "../services/taskService";

function TaskForm({ refreshTasks }) {
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    due_date: "",
  });

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (task.title.trim() === "") return;

    await addTask(task);
    setTask({ title: "", description: "", status: "pending", priority: "medium", due_date: "" });
    refreshTasks();
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.header}>📝 Add a New Task</h2>
      <input
        type="text"
        name="title"
        placeholder="Task Title"
        value={task.title}
        onChange={handleChange}
        style={styles.input}
        required
      />
      <textarea
        name="description"
        placeholder="Task Description"
        value={task.description}
        onChange={handleChange}
        style={styles.textarea}
      />
      <select name="status" value={task.status} onChange={handleChange} style={styles.select}>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <select name="priority" value={task.priority} onChange={handleChange} style={styles.select}>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <input
        type="datetime-local"
        name="due_date"
        value={task.due_date}
        onChange={handleChange}
        style={styles.input}
        min={getMinDateTime()}
      />
      <button type="submit" style={styles.addButton}>➕ Add Task</button>
    </form>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
    background: "#1e1e2f",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
    width: "420px",
    margin: "auto",
    color: "#ffffff",
  },
  header: {
    fontSize: "24px",
    marginBottom: "10px",
    color: "#f1c40f",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #444",
    borderRadius: "6px",
    background: "#2c2c3e",
    color: "#ffffff",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    border: "1px solid #444",
    borderRadius: "6px",
    background: "#2c2c3e",
    color: "#ffffff",
    height: "90px",
  },
  select: {
    width: "100%",
    padding: "12px",
    border: "1px solid #444",
    borderRadius: "6px",
    background: "#2c2c3e",
    color: "#ffffff",
  },
  addButton: {
    background: "#f1c40f",
    color: "#1e1e2f",
    border: "none",
    cursor: "pointer",
    padding: "12px 16px",
    width: "100%",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "0.3s",
  },
};

export default TaskForm;