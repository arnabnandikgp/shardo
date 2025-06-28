import { userModel } from "/Users/arnabnandi/bonkbot_clone/mpc-server-1/models/models.js";
import express from "express";
import { authenticateToken, errorHandler } from "/Users/arnabnandi/bonkbot_clone/mpc-server-1/middleware/index.js";
import {
  aggSendStepOne,
  aggSendStepTwo,
  generateShares,
  recentBlockHash
} from "/Users/arnabnandi/bonkbot_clone/utilities/dist/services/tss-service.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = "123456";

app.use(express.json());
app.use(cors());


app.post("/mpc1/v1/initialize", async (req, res, next) => {
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

app.get("/mpc1/v1/get-keys",authenticateToken, async (req, res, next) => {
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


// send the public key and the public share
app.get("/mpc1/v1/send-public-info", authenticateToken, async (req, res, next) => { 
  try{
    const username = req.user;
    const user = await userModel.findOne({ username: username });
    const pk = user.publicKey;
    const { message_1, secret_state } = await aggSendStepOne(user.privateKey);

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

app.get("/mpc1/v1/sign-txn", authenticateToken, async (req, res, next) => {
  try {
    const recipientAddress = req.query.recipient;
    const amount = req.query.amount;
    const blockhash = req.query.recentBlockHash;
    const PublicKey2 = req.query.otherPublicKey;
    const PublicShare2 = req.query.otherPublicShare;

    const username = req.user;
    const user = await userModel.findOne({ username: username });
    const ownPublicKey = user.publicKey;
    const secret_state = user.secret_state;

    const partialSignature = await aggSendStepTwo({
      keypair: user.privateKey,
      to: recipientAddress,
      amount: amount,
      keys: [ownPublicKey, PublicKey2],
      recentBlockHash: blockhash,
      firstMessages: PublicShare2,
      secretState: secret_state,
    });

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

