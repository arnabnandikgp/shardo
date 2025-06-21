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
const PORT = process.env.PORT || 3000;
const JWT_SECRET = "123456";


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

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: "Authentication token required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid token" });
    }
    next(error);
  }
};

app.post("/mpc1/v1/txn/sign", authenticateToken, async (req, res, next) => {
  try {
    const serializedTx = req.body.message;

    const byteArray = Object.values(serializedTx);

    // Create a new Uint8Array from the array of bytes.
    const uint8Array = new Uint8Array(byteArray);

    const messageV0 = MessageV0.deserialize(uint8Array);
    const tx = new VersionedTransaction(messageV0);

    //convert from string to Uint8Array
    const numberStrings = req.user.privateKey.split(",");
    const numbers = numberStrings.map((str) => parseInt(str.trim(), 10));
    const pvtkey = new Uint8Array(numbers);

    // Use the authenticated user's private key
    const keyPair = Keypair.fromSecretKey(pvtkey);

    const connection = new Connection(
      process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com"
    );
    const { blockhash } = await connection.getLatestBlockhash();

    tx.blockhash = blockhash;
    tx.feePayer = keyPair.publicKey;
    tx.sign([keyPair]);

    const signature = await connection.sendTransaction(tx);
    await connection.confirmTransaction(signature, "confirmed");
    console.log("Transaction signature:", signature);

    // TODO: Add logic to index the transaction request and store it

    res.json({
      success: true,
      signature,
      message: "Transaction signed and sent successfully",
    });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
