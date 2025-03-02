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
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    width: "400px",
    margin: "auto",
  },
  header: {
    fontSize: "22px",
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    height: "80px",
  },
  select: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  addButton: {
    background: "green",
    color: "white",
    border: "none",
    cursor: "pointer",
    padding: "10px 15px",
    width: "100%",
    borderRadius: "5px",
  },
};

export default TaskForm;