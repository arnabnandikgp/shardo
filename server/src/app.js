const { userModel } = require("./models/models");
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
const axios = require("axios");

// Import middleware
const { authenticateToken, errorHandler } = require("./middleware");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "123456";

// Validation schemas
const signupSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

app.use(express.json());
app.use(cors());

app.post("/api/v1/signup", async (req, res, next) => {
  try {
    // Validate request body
    const validatedData = signupSchema.parse(req.body);

    // Check if username already exists
    const existingUser = await userModel.findOne({
      username: validatedData.username,
    });
    if (existingUser) {
      return res.status(400).json({
        error: "Username already exists",
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

    const data = {
      username: validatedData.username,
    };

    axios
      .post("https://localhost:4000/mpc1/v1/initialize", data)
      .then((response) => {
        console.log("Success:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // logic to send the username to the mpc server to make their respective keypair
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
    // get the public keys from the mpc server
    // combine them and store them in database and also display the combined public key to the user
    const response = await axios.get(
      "https://localhost:3000/services/v1/get-public-keys",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Public-Key": user.publicKey,
        },
      }
    );
    if (response.status === 200) {
      //somehow display this as the users public key
      const publicKey = response.data.publicKey;
    }
  } else {
    res.json({
      message: "user not found signup first",
    });
  }
});

app.post("/api/v1/txn/sign", authenticateToken, async (req, res, next) => {
  try {
    const recipientAddress = req.body.recipient;
    const amount = req.body.amount;
    // const recipientPubkey = new PublicKey(recipientAddress);

    const response = await axios.get(
      "http://localhost:3000/api/v1/services/sign-txn",
      { recipient: recipientAddress, amount: amount },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Public-Key": user.publicKey,
        },
      }
    );

    if (response.status === 200) {
      res.json({
        success: true,
        signature: response.data.signature,
        message: "Transaction signed and sent successfully",
      });
    }

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
