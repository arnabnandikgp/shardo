import { userModel } from "./models/models.js";
import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import { z } from "zod";
import axios from "axios";

// Import middleware
import { authenticateToken, errorHandler } from "/Users/arnabnandi/bonkbot_clone/server/src/middleware/index.js";

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "123456";

// import services from "./services/mpc-services.js";

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
     
    await userModel.create({
      username: validatedData.username,
      password: validatedData.password,
    });

    const data = {
      username: validatedData.username,
    };


    const response1 = await axios.post("http://localhost:4000/mpc1/v1/initialize", data);
    const response2 = await axios.post("http://localhost:6000/mpc3/v1/initialize", data);

    if (response1.status === 201 && response2.status === 201) {
      res.status(201).json({
      message: "User created successfully on both the mpc servers",
      });
    }
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

    console.log("token", token);

    // get the public keys from the mpc server
    // combine them and store them in database and also display the combined public key to the user
    const response = await axios.get(
      "http://localhost:9000/services/v1/get-public-keys",
      {
        headers: {
           authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      //somehow display this as the users public key
      const publicKey = response.data.publicKey;
      res.json({
        token,
        message: "signin successful",
        publicKey,
      });
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

    const response = await axios.get(
      "http://localhost:9000/services/v1/sign-txn",
      { recipient: recipientAddress, amount: amount },
      {
        headers: {
          Authorization: `Bearer ${token}`,
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

// app.use(services);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
