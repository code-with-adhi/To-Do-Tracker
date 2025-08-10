// api/todos.js

import mysql from "mysql2/promise";

export default async function handler(req, res) {
  let connection;

  const userId = req.body.userId || req.query.userId;
  if (!userId) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    switch (req.method) {
      // --- READ: Get all todos for the user ---
      case "GET":
        const [todos] = await connection.execute(
          "SELECT id, task, completed, deadline FROM todos WHERE user_id = ?",
          [userId]
        );
        res.status(200).json(todos);
        break;

      // --- CREATE: Add a new todo ---
      case "POST":
        const { task, deadline } = req.body;
        if (!task) {
          return res.status(400).json({ message: "Task is required." });
        }
        // Correctly handle the deadline. If it's an empty string, set it to NULL.
        const deadlineValue = deadline || null;

        await connection.execute(
          "INSERT INTO todos (task, deadline, user_id) VALUES (?, ?, ?)",
          [task, deadlineValue, userId]
        );
        res.status(201).json({
          message: "Todo created successfully!",
        });
        break;

      // --- UPDATE: Update an existing todo ---
      case "PUT":
        const { id, updatedTask, completed, newDeadline } = req.body;
        if (!id) {
          return res.status(400).json({ message: "Todo ID is required." });
        }
        // Correctly handle the deadline. If it's an empty string, set it to NULL.
        const updatedDeadlineValue = newDeadline || null;
        await connection.execute(
          "UPDATE todos SET task = ?, completed = ?, deadline = ? WHERE id = ? AND user_id = ?",
          [updatedTask, completed, updatedDeadlineValue, id, userId]
        );
        res.status(200).json({ message: "Todo updated successfully!" });
        break;

      // --- DELETE: Delete an existing todo ---
      case "DELETE":
        const { todoId } = req.query;
        if (!todoId) {
          return res.status(400).json({ message: "Todo ID is required." });
        }
        await connection.execute(
          "DELETE FROM todos WHERE id = ? AND user_id = ?",
          [todoId, userId]
        );
        res.status(200).json({ message: "Todo deleted successfully!" });
        break;

      default:
        res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error in todos API:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    if (connection) connection.end();
  }
}
