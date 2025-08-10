import mysql from "mysql2/promise";

export default async function handler(req, res) {
  let connection;

  // --- FIX: Add a check to ensure req.body is parsed ---
  if (req.body && typeof req.body === "string") {
    try {
      req.body = JSON.parse(req.body);
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return res.status(400).json({ message: "Invalid JSON format" });
    }
  }

  const userId = req.body?.userId || req.query.userId;
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
      case "GET":
        const [todos] = await connection.execute(
          "SELECT id, task, completed, deadline FROM todos WHERE user_id = ?",
          [userId]
        );
        res.status(200).json(todos);
        break;

      case "POST":
        const { task, deadline } = req.body;
        if (!task) {
          return res.status(400).json({ message: "Task is required." });
        }
        const deadlineValue = deadline || null;

        await connection.execute(
          "INSERT INTO todos (task, deadline, user_id) VALUES (?, ?, ?)",
          [task, deadlineValue, userId]
        );
        res.status(201).json({
          message: "Todo created successfully!",
        });
        break;

      case "PUT":
        const { id, updatedTask, completed } = req.body;
        if (!id) {
          return res.status(400).json({ message: "Todo ID is required." });
        }
        await connection.execute(
          "UPDATE todos SET task = ?, completed = ? WHERE id = ? AND user_id = ?",
          [updatedTask, completed, id, userId]
        );
        res.status(200).json({ message: "Todo updated successfully!" });
        break;

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
