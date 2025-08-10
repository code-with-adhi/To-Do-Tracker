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
      case "GET":
        const [todos] = await connection.execute(
          "SELECT id, task, completed FROM todos WHERE user_id = ?",
          [userId]
        );
        res.status(200).json(todos);
        break;

      case "POST":
        const { task } = req.body;
        if (!task) {
          return res.status(400).json({ message: "Task is required." });
        }
        const [insertResult] = await connection.execute(
          "INSERT INTO todos (task, user_id) VALUES (?, ?)",
          [task, userId]
        );
        res.status(201).json({
          message: "Todo created successfully!",
          id: insertResult.insertId,
        });
        break;

      case "PUT":
        const { id, updatedTask, completed } = req.body;
        if (!id) {
          return res.status(400).json({ message: "Todo ID is required." });
        }
        const [updateResult] = await connection.execute(
          "UPDATE todos SET task = ?, completed = ? WHERE id = ? AND user_id = ?",
          [updatedTask, completed, id, userId]
        );
        if (updateResult.affectedRows === 0) {
          return res
            .status(404)
            .json({ message: "Todo not found or unauthorized." });
        }
        res.status(200).json({ message: "Todo updated successfully!" });
        break;

      case "DELETE":
        const { todoId } = req.query;
        if (!todoId) {
          return res.status(400).json({ message: "Todo ID is required." });
        }
        const [deleteResult] = await connection.execute(
          "DELETE FROM todos WHERE id = ? AND user_id = ?",
          [todoId, userId]
        );
        if (deleteResult.affectedRows === 0) {
          return res
            .status(404)
            .json({ message: "Todo not found or unauthorized." });
        }
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
