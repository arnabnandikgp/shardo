const { userModel } = require("./models");
const { Keypair, Transaction, Connection } = require("@solana/web3.js");
const express = require("express");
const jwt = require("jsonwebtoken");
const bs58 = require('bs58');
const cors = require("cors");
const { z } = require("zod");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = "123456";

// Validation schemas
const signupSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores"),
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
});

app.use(express.json());
app.use(cors());

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  if (err instanceof z.ZodError) {
    return res.status(400).json({
      error: "Validation Error",
      details: err.errors
    });
  }
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message
  });
};

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

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

app.post("/api/v1/signup", async (req, res, next) => {
  try {
    // Validate request body
    const validatedData = signupSchema.parse(req.body);
    
    // Check if username already exists
    const existingUser = await userModel.findOne({ username: validatedData.username });
    if (existingUser) {
      return res.status(400).json({
        error: "Username already exists"
      });
    }

    const keypair = await new Keypair();
    await userModel.create({
      username: validatedData.username,
      password: validatedData.password,
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

app.post("/api/v1/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await userModel.findOne({
    username: username,
    password: password,
  });

  if (user) {
    const token = jwt.sign(
      {
        id: user,
      },
      JWT_SECRET
    );
    res.json({
      token,
      publicKey: user.publicKey,
      message: "signin successful",
    });
  } else {
    res.json({
      message: "user not found signup first",
    });
  }
});

app.post("/api/v1/txn/sign", authenticateToken, async (req, res, next) => {
  try {
    const serializedTx = req.body.message;
    const tx = Transaction.from(Buffer.from(serializedTx));
    
    //convert from string to Uint8Array
    const numberStrings = req.user.privateKey.split(',');
    const numbers = numberStrings.map(str => parseInt(str.trim(), 10));
    const pvtkey = new Uint8Array(numbers);

    // Use the authenticated user's private key
    const keyPair = Keypair.fromSecretKey(
      pvtkey
    );

    const connection = new Connection(process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com");
    const { blockhash } = await connection.getLatestBlockhash();
    
    tx.blockhash = blockhash;
    tx.feePayer = keyPair.publicKey;

    tx.sign(keyPair);

    const signature = await connection.sendTransaction(tx, [keyPair]);
    console.log("Transaction signature:", signature);

    // TODO: Add logic to index the transaction request and store it 

    res.json({
      success: true,
      signature,
      message: "Transaction signed and sent successfully"
    });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
