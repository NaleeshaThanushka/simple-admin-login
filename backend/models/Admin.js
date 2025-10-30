import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePhoto: { type: String, default: "" }, // store photo URL or base64
});

export default mongoose.model("Admin", adminSchema);
