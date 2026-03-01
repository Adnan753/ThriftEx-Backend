const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      "secretkey",
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};