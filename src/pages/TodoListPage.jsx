// src/pages/TodoListPage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function TodoListPage() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get the userId from local storage for API calls
  const userId = localStorage.getItem("userId");

  // --- Authentication and Data Fetching ---
  useEffect(() => {
    // Redirect to login if no userId is found
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchTodos = async () => {
      try {
        const response = await axios.get(`/api/todos?userId=${userId}`);
        setTodos(response.data);
      } catch (err) {
        console.error("Failed to fetch todos:", err);
        setError("Failed to load todos.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [userId, navigate]);

  // --- CRUD Operations ---
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      await axios.post("/api/todos", { userId, task: newTask });
      setNewTask("");
      // Refetch todos after adding a new one
      const response = await axios.get(`/api/todos?userId=${userId}`);
      setTodos(response.data);
    } catch (err) {
      console.error("Failed to add todo:", err);
      setError("Failed to add todo.");
    }
  };

  const handleToggleComplete = async (todoId, completed) => {
    try {
      await axios.put("/api/todos", {
        userId,
        id: todoId,
        completed: !completed,
      });
      // Update the state locally to avoid a full re-fetch
      setTodos(
        todos.map((todo) =>
          todo.id === todoId ? { ...todo, completed: !completed } : todo
        )
      );
    } catch (err) {
      console.error("Failed to update todo:", err);
      setError("Failed to update todo.");
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await axios.delete(`/api/todos?userId=${userId}&todoId=${todoId}`);
      // Filter out the deleted todo from the state
      setTodos(todos.filter((todo) => todo.id !== todoId));
    } catch (err) {
      console.error("Failed to delete todo:", err);
      setError("Failed to delete todo.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  if (loading) {
    return <div className="loading-message">Loading todos...</div>;
  }

  return (
    <div className="todo-list-container">
      <div className="header-actions">
        <h2>Your To-Do List</h2>
        <button onClick={handleLogout} className="logout-button">
          Log Out
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleAddTodo} className="add-todo-form">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="new-task-input"
        />
        <button type="submit" className="add-todo-button">
          Add Todo
        </button>
      </form>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`todo-item ${todo.completed ? "completed" : ""}`}
          >
            <span>{todo.task}</span>
            <div className="todo-actions">
              <button
                onClick={() => handleToggleComplete(todo.id, todo.completed)}
                className="toggle-complete-button"
              >
                {todo.completed ? "Undo" : "Complete"}
              </button>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoListPage;
