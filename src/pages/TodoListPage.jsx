import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CountdownTimer from "../components/CountdownTimer";

function TodoListPage() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newDueHour, setNewDueHour] = useState("12");
  const [newDueMinute, setNewDueMinute] = useState("00");
  const [newDueAmPm, setNewDueAmPm] = useState("AM");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);
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
        const sortedTodos = [...response.data].sort((a, b) => {
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline) - new Date(b.deadline);
        });

        setTodos(sortedTodos);
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
        let hour24 = parseInt(newDueHour, 10);
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
      setNewDueHour("12");
      setNewDueMinute("00");
      setNewDueAmPm("AM");

      const response = await axios.get(`/api/todos?userId=${userId}`);
      const sortedTodos = [...response.data].sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      });
      setTodos(sortedTodos);
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

  const isDeadlineToday = (deadline) => {
    if (!deadline) return false;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    return (
      today.getDate() === deadlineDate.getDate() &&
      today.getMonth() === deadlineDate.getMonth() &&
      today.getFullYear() === deadlineDate.getFullYear()
    );
  };

  const isDeadlineTomorrow = (deadline) => {
    if (!deadline) return false;
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const deadlineDate = new Date(deadline);
    return (
      tomorrow.getDate() === deadlineDate.getDate() &&
      tomorrow.getMonth() === deadlineDate.getMonth() &&
      tomorrow.getFullYear() === deadlineDate.getFullYear()
    );
  };

  if (loading) {
    return <div className="loading-message">Loading todos...</div>;
  }

  const formatTime = (num) => String(num).padStart(2, "0");
  const hours12 = Array.from({ length: 12 }, (_, i) => formatTime(i + 1));
  const minutes = Array.from({ length: 60 }, (_, i) => formatTime(i));
  const ampm = ["AM", "PM"];

  const activeTasks = todos.filter((todo) => !todo.completed);
  const completedTasks = todos.filter((todo) => todo.completed);

  return (
    <div className="todo-list-container">
      <div className="task-filter-container">
        <h2>Your To-Do List</h2>
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="task-filter-toggle-button"
        >
          {showCompleted ? "Show Active Tasks" : "Show Completed Tasks"}
        </button>
      </div>

      <form onSubmit={handleAddTodo} className="add-todo-form">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="new-task-input"
        />
        <div className="time-selectors">
          <input
            type="date"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
            className="deadline-input"
            title="Set a deadline date"
          />
          <select
            value={newDueHour}
            onChange={(e) => setNewDueHour(e.target.value)}
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
        </div>
        <button type="submit" className="add-todo-button">
          Add Todo
        </button>
      </form>

      {errorMessage && <p className="error-message popup">{errorMessage}</p>}

      <div className="tasks-section">
        <h3>Active Tasks</h3>
        {activeTasks.length > 0 ? (
          <ul className="todo-list">
            {activeTasks.map((todo) => (
              <li
                key={todo.id}
                className={`todo-item 
                  ${isDeadlineToday(todo.deadline) ? "due-today" : ""} 
                  ${isDeadlineTomorrow(todo.deadline) ? "due-tomorrow" : ""}`}
              >
                <div>
                  <span>{todo.task}</span>
                  {todo.deadline && (
                    <div className="deadline-details">
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
                      <CountdownTimer deadline={todo.deadline} />
                    </div>
                  )}
                </div>
                <div className="todo-actions">
                  <button
                    onClick={() =>
                      handleToggleComplete(todo.id, todo.completed)
                    }
                    className="toggle-complete-button"
                  >
                    Complete
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
        ) : (
          <p className="no-tasks-message">No active tasks. Add a new one!</p>
        )}
      </div>

      <div className="tasks-section completed-tasks-section">
        <h3>Completed Tasks</h3>
        {completedTasks.length > 0 ? (
          <ul className="todo-list">
            {completedTasks.map((todo) => (
              <li key={todo.id} className="todo-item completed">
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
                    onClick={() =>
                      handleToggleComplete(todo.id, todo.completed)
                    }
                    className="toggle-complete-button"
                  >
                    Undo
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
        ) : (
          <p className="no-tasks-message">No completed tasks yet.</p>
        )}
      </div>
    </div>
  );
}

export default TodoListPage;
