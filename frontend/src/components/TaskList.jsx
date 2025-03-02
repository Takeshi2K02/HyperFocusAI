import React, { useEffect, useState } from "react";
import { getTasks, deleteTask } from "../services/taskService";

function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  const handleDelete = async (taskId) => {
    await deleteTask(taskId);
    fetchTasks(); // Refresh task list after deletion
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "#f39c12";
      case "in-progress": return "#3498db";
      case "completed": return "#2ecc71";
      default: return "#bdc3c7";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "#e74c3c";
      case "medium": return "#f1c40f";
      case "low": return "#2ecc71";
      default: return "#95a5a6";
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>📋 Task List</h2>
      {tasks.length === 0 ? (
        <p style={styles.noTask}>No tasks available. Add some!</p>
      ) : (
        <div style={styles.taskGrid}>
          {tasks.map((task) => (
            <div key={task._id} style={styles.taskCard}>
              <h3>{task.title}</h3>
              <p><strong>Description:</strong> {task.description || "No description"}</p>
              <p><strong>Priority:</strong> <span style={{color: getPriorityColor(task.priority)}}>{task.priority}</span></p>
              <p><strong>Status:</strong> <span style={{color: getStatusColor(task.status)}}>{task.status}</span></p>
              <p><strong>Due Date:</strong> {task.due_date ? new Date(task.due_date).toLocaleString() : "No due date"}</p>
              <p><strong>Created At:</strong> {new Date(task.created_at).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(task.updated_at).toLocaleString()}</p>
              <button onClick={() => handleDelete(task._id)} style={styles.deleteButton}>❌ Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "80%",
    margin: "auto",
    textAlign: "center",
    padding: "20px",
  },
  header: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  noTask: {
    fontSize: "18px",
    color: "#777",
  },
  taskGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  taskCard: {
    background: "#fff",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "left",
  },
  deleteButton: {
    background: "#e74c3c",
    color: "white",
    border: "none",
    cursor: "pointer",
    padding: "10px 15px",
    marginTop: "10px",
    borderRadius: "5px",
    width: "100%",
  },
};

export default TaskList;
