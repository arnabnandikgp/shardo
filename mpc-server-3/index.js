import { userModel } from "/Users/arnabnandi/bonkbot_clone/mpc-server-3/models/models.js";
import express from "express";
import { authenticateToken, errorHandler } from "/Users/arnabnandi/bonkbot_clone/mpc-server-3/middleware/index.js";
import {
  aggSendStepOne,
  aggSendStepTwo,
  generateShares,
} from "/Users/arnabnandi/bonkbot_clone/utilities/dist/services/tss-service.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 6000;
const JWT_SECRET = "123456";

app.use(express.json());
app.use(cors());


app.post("/mpc3/v1/initialize", async (req, res, next) => {
  try {
    const username  = req.body.username;
    const { secretShare, publicShare } = await generateShares();
    await userModel.create({
      username: username,
      privateKey: secretShare,
      publicKey: publicShare,
    });
    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
});

app.get("/mpc3/v1/get-keys",authenticateToken, async (req, res, next) => {
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

app.get("/mpc3/v1/send-public-info", authenticateToken, async (req, res, next) => { 
  try{
    const username = req.user;
    const user = await userModel.findOne({ username: username });
    const pk = user.publicKey;

    const { message_1, secret_state } = await aggSendStepOne(user.privateKey);
    // store it into the user database and use it later
    user.secret_state = secret_state;
    await user.save();

    res.status(200).json({
      message: "User found successfully, transmitting the public information",
      publicKey: pk,
      publicShare: message_1,
    });
  } catch (error)
  {
    next(error);
  }
});

app.get("/mpc3/v1/sign-txn", authenticateToken, async (req, res, next) => {
  try {
    const recipientAddress = req.query.recipient;
    const amount = req.query.amount;
    const blockhash = req.query.recentBlockHash;
    const PublicKey1 = req.query.otherPublicKey;
    const PublicShare1 = req.query.otherPublicShare;

    const username = req.user;
    const user = await userModel.findOne({ username: username });
    const ownPublicKey = user.publicKey;

    // const { _, secret_state } = await aggSendStepOne(user.privateKey); // this is generated later and thus do not matches with the publicshare that was sent to the other server
    const secret_state = user.secret_state;
    console.log("the user", user)

    console.log("secret_state 22", secret_state);
    console.log("the input parameters");
    console.log("user.privateKey", user.privateKey);
    console.log("recipientAddress", recipientAddress);
    console.log("amount", amount);
    console.log("ownPublicKey and PublicKey2", ownPublicKey, PublicKey1);
    console.log("blockhash", blockhash);
    console.log("PublicShare2", PublicShare1);
    console.log("secret_state 23", secret_state);


    const partialSignature = await aggSendStepTwo({
      keypair: user.privateKey,
      to: recipientAddress,
      amount: amount,
      keys: [ownPublicKey, PublicKey1],
      recentBlockHash: blockhash,
      firstMessages: PublicShare1,
      secretState: secret_state,
    });

    console.log("mpc server 2 signature?", partialSignature.partialSignature);

    //send this partial signature to the services

    res.status(200).json({
      sig: partialSignature.partialSignature,
    });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

