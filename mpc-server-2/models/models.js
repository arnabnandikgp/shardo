import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://admin:adminpassword@localhost:27017/mpc2?authSource=admin";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const UserSchema = new mongoose.Schema({
  username: String,
  privateKey: String,
  publicKey: String,
  secret_state:{
    type: String,
    default: null,
  },
});

export const userModel = mongoose.model("users", UserSchema);

