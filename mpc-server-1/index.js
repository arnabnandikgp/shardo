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

import {
  aggSendStepOne,
  aggSendStepTwo,
} from '/Users/arnabnandi/bonkbot_clone/utilities/dist/services/tss-service.js';


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
      // publicKey: keypair.publicKey.toString(),
    });
  } catch (error) {
    next(error);
  }
});


app.get("/mpc1/v1/get-keys", async (req, res, next) => {
  try {
    const username = req.user;
    const user = await userModel.findOne({ username: username });
    res.status(200).json({
      message: "User found successfully",
      publicKey: user.publicKey,
    });
  } catch (error) {
    next(error);
  }
});



app.get("/mpc1/v1/sign-txn", authenticateToken, async (req, res, next) => {
  try {
    const username = req.user;
    const user = await userModel.findOne({ username: username });
    const blockhash = req.body.recentBlockHash;
    const amount = req.body.amount;
    const recipientAddress= req.body.recipientAddress;
    const ownPublicKey = user.publicKey;


    const{secretShare, publicShare} = await aggSendStepOne(user.privateKey);
    // fetch secret state and the public share of the other mpc server
    // using a axios call to the other mpc server
    const res = await axios.get("http://localhost:4000/mpc1/v1/get-keys", {
      headers: {
        Authorization: `Bearer ${req.token}`,
        "X-Public-Key": req.user.publicKey,
      },
    });
    const otherSecretShare = res.data.secretShare;
    const otherPublicKey = res.data.publicKey;


    const partialSignature = await aggSendStepTwo(user.privateKey, recipientAddress, amount, ownPublicKey, otherPublicKey, blockhash, secretShare, otherSecretShare);


    //send this partial signature to the services

    
    res.status(200).json({
      partialSignature: partialSignature,
    });
  } catch (error) {
    next(error);
  }
});


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
