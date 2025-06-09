const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/cloudapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  privateKey: String,
  publicKey: String,
});

const userModel = mongoose.model("users", UserSchema);

module.exports = {
  userModel,
};
