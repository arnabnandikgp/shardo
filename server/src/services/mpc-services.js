import express from "express";
import axios from "axios";
import {
  aggregateKeys,
  aggregateSignaturesAndBroadcast,
  recentBlockHash,
} from '/Users/arnabnandi/bonkbot_clone/utilities/dist/services/tss-service.js'; // Adjust the import path as needed
import { authenticateToken, errorHandler } from "/Users/arnabnandi/bonkbot_clone/server/src/middleware/index.js";

const appservice = express();
const PORT = process.env.PORT || 9000;

appservice.get("/services/v1/get-public-keys", authenticateToken, async (req, res, next) => {
  try {

    const username = req.user.username;

    const res1 = await axios.get(
      "http://localhost:4000/mpc1/v1/get-keys",
      {
        params: { username }, // query params
        headers: { Authorization: `Bearer ${req.token}` }
      }
    );

    const res2 = await axios.get(
      "http://localhost:6000/mpc3/v1/get-keys",
      {
        params: { username }, // query params
        headers: { Authorization: `Bearer ${req.token}` }
      }
    );

    const combinedPublicKey = await aggregateKeys(res1.data.publicKey, res2.data.publicKey);

    res.json({
      success: true,
      publicKey: combinedPublicKey,
      message: "This is the combined public key",
    });
  }
  catch (error) {
    next(error);
  }
  });

appservice.get("/services/v1/sign-txn", authenticateToken, async (req, res, next) => {
  try {
    const recipientAddress = req.query.recipient;
    const amount = req.query.amount;
    const token = req.token;

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
        Authorization: `Bearer ${req.token}`,
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
        Authorization: `Bearer ${req.token}`,
      },
    })

    const {output} = await aggregateSignaturesAndBroadcast({
      to : recipientAddress,
      amount: amount,
      keys: [publicKey1, publicKey2],
      recentBlockHash: blockhash.blockHash,
      signatures: [sigmpc1.data.sig, sigmpc2.data.sig],
    });

    res.json({
      success: true,
      txn_details: output,
      message: "Transaction signed and sent successfully",
    });

  }
  catch (error) {
    console.error(error);
    next(error);
  }
});

appservice.use(errorHandler);

appservice.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
