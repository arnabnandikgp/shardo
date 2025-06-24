import mongoose from "mongoose";

mongoose
  .connect("mongodb://admin:adminpassword@localhost:27017/mpc2", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin", 
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const UserSchema = new mongoose.Schema({
  username: String,
  privateKey: String,
  publicKey: String,
});

export const userModel = mongoose.model("users", UserSchema);

