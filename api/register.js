import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const query = "INSERT INTO users (email, password_hash) VALUES (?, ?)";
    const [result] = await connection.execute(query, [email, passwordHash]);

    res.status(201).json({
      message: "User registered successfully!",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Error during registration:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ message: "This email is already registered." });
    }

    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    if (connection) connection.end();
  }
}
