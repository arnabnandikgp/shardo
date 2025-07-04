import { userModel } from "./models/models.js";
import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import { z } from "zod";
import axios from "axios";
import { authenticateToken, errorHandler } from "./middleware/index.js";
import bcrypt from "bcryptjs";
import {
  aggregateKeys,
  aggregateSignaturesAndBroadcast,
  recentBlockHash,
} from '../../utilities/dist/services/tss-service.js'; // Adjust the import path as needed
import { Connection, LAMPORTS_PER_SOL, PublicKey, } from "@solana/web3.js";

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "123456";

const connection = new Connection("https://solana-devnet.g.alchemy.com/v2/hFcItZcCi7sBqEK3tddTpMWbfSzpm6ae", "confirmed");
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

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    await userModel.create({
      username: validatedData.username,
      password: hashedPassword,
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

// Helper to get public keys
async function getPublicKeysHelper(token, username) {
  const res1 = await axios.get(
    "http://localhost:4000/mpc1/v1/get-keys",
    {
      params: { username },
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  const res2 = await axios.get(
    "http://localhost:6000/mpc3/v1/get-keys",
    {
      params: { username },
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  const combinedPublicKey = await aggregateKeys(res1.data.publicKey, res2.data.publicKey);
  return {
    success: true,
    publicKey: combinedPublicKey,
    message: "This is the combined public key",
  };
}

// Helper to sign transaction
async function signTxnHelper(token, recipientAddress, amount) {
  const publicResp1 = await axios.get("http://localhost:4000/mpc1/v1/send-public-info",
    {
      headers: {
         authorization: `Bearer ${token}`,
      },
    }
  );
  const publicShare1 = publicResp1.data.publicShare;
  const publicKey1 = publicResp1.data.publicKey;
  const publicResp2 = await axios.get("http://localhost:6000/mpc3/v1/send-public-info",
    {
      headers: {
         authorization: `Bearer ${token}`,
      },
    }
  );
  const publicShare2 = publicResp2.data.publicShare;
  const publicKey2 = publicResp2.data.publicKey;
  const blockhash = await recentBlockHash("devnet");
  const sigmpc1 = await axios.get("http://localhost:4000/mpc1/v1/sign-txn",
    {
      params: {
        recipient: recipientAddress,
        amount: amount,
        recentBlockHash: blockhash.blockHash,
        otherPublicKey: publicKey2,
        otherPublicShare: publicShare2
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  const sigmpc2 = await  axios.get("http://localhost:6000/mpc3/v1/sign-txn", 
    {
    params: {      
      recipient: recipientAddress,
      amount: amount,
      recentBlockHash: blockhash.blockHash,
      otherPublicKey: publicKey1,
      otherPublicShare: publicShare1
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const {output} = await aggregateSignaturesAndBroadcast({
    to : recipientAddress,
    amount: amount,
    keys: [publicKey1, publicKey2],
    recentBlockHash: blockhash.blockHash,
    signatures: [sigmpc1.data.sig, sigmpc2.data.sig],
  });
  return {
    success: true,
    txn_details: output,
    message: "Transaction signed and sent successfully",
  };
}

app.post("/api/v1/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await userModel.findOne({
    username: username,
  });

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      {
        id: user,
      },
      JWT_SECRET
    );

    // Use helper instead of axios to localhost
    const publicKeyResult = await getPublicKeysHelper(token, username);
    if (publicKeyResult && publicKeyResult.publicKey && publicKeyResult.publicKey.aggregatedPublicKey) {
      const publicKey = publicKeyResult.publicKey.aggregatedPublicKey;
      res.json({
        token,
        message: "signin successful",
        publicKey,
      });
    } else {
      res.status(500).json({ message: "Failed to get public key" });
    }
  } else {
    res.json({
      message: "user not found signup first",
    });
  }
});

app.get("/api/v1/get-payment-info", async(req, res)=>{

  try{
  const publicKeystr = req.query.publicKey;
  const publicKey = new PublicKey(publicKeystr);
  let lamports = await connection.getBalance(publicKey);
  const costInSol = lamports / LAMPORTS_PER_SOL;

  res.json({
    message: "Payment info fetched successfully",
    costInSol
  })}catch (error) {
    next(error);
  }
});

app.post("/api/v1/txn/sign", authenticateToken, async (req, res, next) => {
  try {
    const recipientAddress = req.body.recipient;
    const amount = req.body.amount;
    const token = req.token;

    // Use helper instead of axios to localhost
    const result = await signTxnHelper(token, recipientAddress, amount);
    if (result && result.txn_details) {
      res.json({
        success: true,
        signature: result.txn_details,
        message: "Transaction signed and sent successfully",
      });
    } else {
      res.status(500).json({ message: "Failed to sign transaction" });
    }
  } catch (error) {
    next(error);
  }
});

app.post("/api/v1/get-airdrop", async(req, res, next)=>{
  try{

    const publicKeyStr = req.body.publicKey;
    const amount = req.body.amount;

    const publicKey = new PublicKey(publicKeyStr);
    const airdropSignature = await connection.requestAirdrop(
        publicKey,
        amount* LAMPORTS_PER_SOL
      );
    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: airdropSignature,
      });

    res.json({
      message: "Airdrop fetched successfully",
    })
}catch (error) {
    console.log(error);
    next(error);
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// export default app;
