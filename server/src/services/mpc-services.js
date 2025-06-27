// const { userModel } = require("/Users/arnabnandi/bonkbot_clone/server/src/models/models.js");
import express from "express";
import axios from "axios";
import {
  aggregateKeys,
  aggregateSignaturesAndBroadcast,
} from '/Users/arnabnandi/bonkbot_clone/utilities/dist/services/tss-service.js'; // Adjust the import path as needed

const router = express.Router();

const appservice = express();
const PORT = process.env.PORT || 9000;
// Import middleware
import { authenticateToken, errorHandler } from "/Users/arnabnandi/bonkbot_clone/server/src/middleware/index.js";

appservice.get("/services/v1/get-public-keys", authenticateToken, async (req, res, next) => {
  try {

    const username = req.user.username;

    console.log("token is   ",req.token )
    console.log("username", username)

    const res1 = await axios.get(
      "http://localhost:4000/mpc1/v1/get-keys",
      {
        params: { username }, // query params
        headers: { Authorization: `Bearer ${req.token}` }
      }
    );
    console.log("somethign aftert the frst req", res1.data)
    console.log("res1.body.publicKey",res1.data.publicKey)

    const res2 = await axios.get(
      "http://localhost:6000/mpc3/v1/get-keys",
      {
        params: { username }, // query params
        headers: { Authorization: `Bearer ${req.token}` }
      }
    );

    console.log("res2 happend")

    const combinedPublicKey = await aggregateKeys(res1.data.publicKey, res2.data.publicKey);

    res.json({
      success: true,
      publicKey: combinedPublicKey,
      message: "This is the combined public key",
    });
  }
  catch (error) {
    console.log("something went wrong")
    // console.error(error);
    next(error);
  }
  });

appservice.get("/services/v1/sign-txn", authenticateToken, async (req, res, next) => {
  try {
    console.log("meow meow")
    const recipientAddress = req.body.recipient;
    const amount = req.body.amount;

    const recentBlockHash = await recentBlockHash();


   const sigmpc1 = await  axios.get("http://localhost:4000/api/v1/mpc1/sign-txn", {
      recipient: recipientAddress,
      amount: amount,
      recentBlockHash: recentBlockHash,
    },{
      headers: {
        Authorization: `Bearer ${req.token}`,
      },
    })

    const sigmpc2 = await  axios.get("http://localhost:5000/api/v1/mpc2/sign-txn", {
      recipient: recipientAddress,
      amount: amount,
      recentBlockHash: recentBlockHash,
    },{
      headers: {
        Authorization: `Bearer ${req.token}`,
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


appservice.use(errorHandler);

appservice.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
