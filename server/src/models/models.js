import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://admin:adminpassword@localhost:27017/cloudapp?authSource=admin";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

export const userModel = mongoose.model("users", UserSchema);

