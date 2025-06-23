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
import {
  aggregateKeys,
  aggregateSignaturesAndBroadcast,
  recentBlockHash,
} from '/Users/arnabnandi/bonkbot_clone/utilities/dist/services/tss-service.js'; // Adjust the import path as needed

// Import middleware
const { authenticateToken, errorHandler } = require("./middleware");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "123456";


app.use(express.json());
app.use(cors());

app.get("/api/v1/services/v1/get-public-keys", authenticateToken, async (req, res, next) => {
  try {
    const username = req.user;

   const res1 = await  axios.get("http://localhost:3000/api/v1/mpc1/get-keys", {
      user: username,
    })

    const res2 = await  axios.get("http://localhost:3000/api/v1/mpc2/get-keys", {
      username: user,
    })

    const combinedPublicKey = await aggregateKeys(res1.data.publicKey, res2.data.publicKey);

    res.json({
      success: true,
      publicKey:combinedPublicKey,
      message: "This is the combined public key",
    });
  }
  catch (error) {
    console.error(error);
    next(error);
  }
  });

app.get("/api/v1/services/sign-txn", authenticateToken, async (req, res, next) => {
  try {
    const recipientAddress = req.body.recipient;
    const amount = req.body.amount;
    const recipientPubkey = new PublicKey(recipientAddress);

    const recentBlockHash = await recentBlockHash();


   const sigmpc1 = await  axios.get("http://localhost:4000/api/v1/mpc1/sign-txn", {
      recipient: recipientAddress,
      amount: amount,
      recentBlockHash: recentBlockHash,
    },{
      headers: {
        Authorization: `Bearer ${req.token}`,
        "X-Public-Key": req.user.publicKey,
      },
    })

    const sigmpc2 = await  axios.get("http://localhost:4000/api/v1/mpc2/sign-txn", {
      recipient: recipientAddress,
      amount: amount,
      recentBlockHash: recentBlockHash,
    },{
      headers: {
        Authorization: `Bearer ${req.token}`,
        "X-Public-Key": req.user.publicKey,
      },
    })


    const signature = await aggregateSignaturesAndBroadcast(recipientAddress, amount, sigmpc1.body.signature, sigmpc2.body.signature);

    if(signature.status === 200){
      res.json({
        success: true,
        signature: signature.data.signature,
        message: "Transaction signed and sent successfully",
      });
    }

    res.json({
      success: true,
      signature: res.data.signature,
      message: "Transaction signed and sent successfully",
    });
  }
  catch (error) {
    console.error(error);
    next(error);
  }
  });
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
