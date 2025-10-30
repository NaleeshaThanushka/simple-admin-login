// db.js
// Import mongoose to connect with MongoDB
import mongoose from "mongoose";

// Async function to connect to MongoDB Atlas
export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://naleeshathanushka:760733708@cluster0.muruu.mongodb.net/simpleLogin"
    );
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1); // stop server if DB fails
  }
};
