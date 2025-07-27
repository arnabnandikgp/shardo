import jwt from "jsonwebtoken";
import { userModel } from "../models/models.js";

const JWT_SECRET = process.env.JWT_SECRET || "123456";

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: "Authentication token required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userModel.findOne({ username: decoded.id.username });


    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user.username;
    req.token = token;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid token" });
    }
    next(error);
  }
};

export {
  authenticateToken,
};
