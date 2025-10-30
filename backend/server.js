// server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "./db.js";
import Admin from "./models/Admin.js";

const app = express();

// ✅ Middleware
app.use(cors());           // Enable CORS
app.use(express.json());    // Parse JSON requests

// ✅ Connect to MongoDB
connectDB();

// ✅ Secret key for JWT (for learning only)
const JWT_SECRET = "secretkey123";

// =====================
// Routes
// =====================

// ✅ Register Admin
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log("Register Request:", req.body);

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

    // Hash password and save
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Login Admin
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: "Invalid username" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // Sign JWT token
    const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Admin Profile (protected route)
app.get("/profile", (req, res) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // You can return more info if needed
    res.json({ message: `Welcome ${decoded.username}! Your ID is ${decoded.id}` });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Update profile photo
app.post("/profile/photo", async (req, res) => {
  const token = req.headers.authorization;
  const { photo } = req.body; // photo can be base64 string

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.profilePhoto = photo; // update photo
    await admin.save();

    res.json({ message: "Profile photo updated successfully" });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// =====================
// Start Server
// =====================
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
