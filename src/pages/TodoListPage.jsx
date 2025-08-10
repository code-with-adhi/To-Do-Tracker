// src/pages/TodoListPage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function TodoListPage() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newDueHour12, setNewDueHour12] = useState("12"); // State for 12-hour format
  const [newDueMinute, setNewDueMinute] = useState("00");
  const [newDueAmPm, setNewDueAmPm] = useState("AM");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
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
        setErrorMessage("Failed to load todos.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [userId, navigate]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) {
      setErrorMessage("Task cannot be empty.");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    try {
      let deadlineValue = null;
      if (newDeadline) {
        let hour24 = parseInt(newDueHour12, 10);
        if (newDueAmPm === "PM" && hour24 !== 12) {
          hour24 += 12;
        } else if (newDueAmPm === "AM" && hour24 === 12) {
          hour24 = 0;
        }
        const hourString = String(hour24).padStart(2, "0");
        deadlineValue = `${newDeadline}T${hourString}:${newDueMinute}:00`;
      }

      await axios.post("/api/todos", {
        userId,
        task: newTask,
        deadline: deadlineValue,
      });
      setNewTask("");
      setNewDeadline("");
      setNewDueHour12("12");
      setNewDueMinute("00");
      setNewDueAmPm("AM");
      const response = await axios.get(`/api/todos?userId=${userId}`);
      setTodos(response.data);
      setErrorMessage(null);
    } catch (err) {
      console.error("Failed to add todo:", err);
      setErrorMessage(err.response?.data?.message || "Failed to add todo.");
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleToggleComplete = async (todoId, completed) => {
    try {
      const todoToUpdate = todos.find((todo) => todo.id === todoId);
      await axios.put("/api/todos", {
        userId,
        id: todoId,
        updatedTask: todoToUpdate.task,
        completed: !completed,
        newDeadline: todoToUpdate.deadline,
      });
      setTodos(
        todos.map((todo) =>
          todo.id === todoId ? { ...todo, completed: !completed } : todo
        )
      );
    } catch (err) {
      console.error("Failed to update todo:", err);
      setErrorMessage("Failed to update todo.");
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await axios.delete(`/api/todos?userId=${userId}&todoId=${todoId}`);
      setTodos(todos.filter((todo) => todo.id !== todoId));
    } catch (err) {
      console.error("Failed to delete todo:", err);
      setErrorMessage("Failed to delete todo.");
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  if (loading) {
    return <div className="loading-message">Loading todos...</div>;
  }

  const formatTime = (num) => String(num).padStart(2, "0");
  const hours12 = Array.from({ length: 12 }, (_, i) => formatTime(i + 1));
  const minutes = Array.from({ length: 60 }, (_, i) => formatTime(i));
  const ampm = ["AM", "PM"];

  return (
    <div className="todo-list-container">
      <h2>Your To-Do List</h2>

      <form onSubmit={handleAddTodo} className="add-todo-form">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="new-task-input"
        />
        <input
          type="date"
          value={newDeadline}
          onChange={(e) => setNewDeadline(e.target.value)}
          className="deadline-input"
          title="Set a deadline date"
        />
        <select
          value={newDueHour12}
          onChange={(e) => setNewDueHour12(e.target.value)}
          className="time-select"
          title="Set due hour"
        >
          {hours12.map((hour) => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>
        <span className="time-separator">:</span>
        <select
          value={newDueMinute}
          onChange={(e) => setNewDueMinute(e.target.value)}
          className="time-select"
          title="Set due minute"
        >
          {minutes.map((minute) => (
            <option key={minute} value={minute}>
              {minute}
            </option>
          ))}
        </select>
        <select
          value={newDueAmPm}
          onChange={(e) => setNewDueAmPm(e.target.value)}
          className="ampm-select"
          title="Set AM/PM"
        >
          {ampm.map((period) => (
            <option key={period} value={period}>
              {period}
            </option>
          ))}
        </select>
        <button type="submit" className="add-todo-button">
          Add Todo
        </button>
      </form>

      {errorMessage && <p className="error-message popup">{errorMessage}</p>}

      <ul className="todo-list">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`todo-item ${todo.completed ? "completed" : ""}`}
          >
            <div>
              <span>{todo.task}</span>
              {todo.deadline && (
                <span className="deadline">
                  (Due:{" "}
                  {new Date(todo.deadline).toLocaleString("en-IN", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                  )
                </span>
              )}
            </div>
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
