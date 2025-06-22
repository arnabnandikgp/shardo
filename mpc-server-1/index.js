const { userModel } = require("./models");
const {
  Keypair,
  Connection,
  VersionedTransaction,
  MessageV0,
} = require("@solana/web3.js");
const express = require("express");
const jwt = require("jsonwebtoken");
const bs58 = require("bs58");
const cors = require("cors");
const { z } = require("zod");

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = "123456";
const { authenticateToken, errorHandler } = require("../server/src/middleware");


app.use(express.json());
app.use(cors());

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  if (err instanceof z.ZodError) {
    return res.status(400).json({
      error: "Validation Error",
      details: err.errors,
    });
  }
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
};

app.post("/mpc1/v1/initialize", async (req, res, next) => {
  try {
    const { username } = req.body;
    const keypair = await new Keypair();
    await userModel.create({
      username: username,
      privateKey: keypair.secretKey.toString(),
      publicKey: keypair.publicKey.toString(),
    });
    res.status(201).json({
      message: "User created successfully",
      publicKey: keypair.publicKey.toString(),
    });
  } catch (error) {
    next(error);
  }
});

app.get("/mpc1/v1/public-keys", async (req, res, next) => {
  try {
    // logic to assemble the combined public keys from both the mpc servers
    
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
