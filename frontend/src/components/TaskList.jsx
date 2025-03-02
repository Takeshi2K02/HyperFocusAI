import React, { useEffect, useState } from "react";
import { getTasks, deleteTask } from "../services/taskService";

function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const data = await getTasks();
    console.log("Fetched Tasks:", data);  // Debugging log
    setTasks(data);
  };
  

  const handleDelete = async (taskId) => {
    await deleteTask(taskId);
    fetchTasks(); // Refresh task list after deletion
  };

  return (
    <div style={styles.container}>
      <h2>📋 Task List</h2>
      {tasks.length === 0 ? (
        <p>No tasks available. Add some!</p>
      ) : (
        <ul style={styles.list}>
          {tasks.map((task) => (
            <li key={task._id} style={styles.taskItem}>
              {task.title}
              <button onClick={() => handleDelete(task._id)} style={styles.deleteButton}>❌</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "50%",
    margin: "auto",
    textAlign: "center",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  taskItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    borderBottom: "1px solid #ccc",
  },
  deleteButton: {
    background: "red",
    color: "white",
    border: "none",
    cursor: "pointer",
    padding: "5px 10px",
  },
};

export default TaskList;