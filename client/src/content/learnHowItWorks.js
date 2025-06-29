// Content for the 'Learn How It Works' section on the landing page
const learnHowItWorksContent = `
This wallet is based on the open-source implementation of TSS protocol that is available here: [TSS/MPC](https://github.com/ZenGo-X/solana-tss) protocol.
The shardo wallet is capable of allowing for setting up two MPC servers and signing transactions using the TSS protocol.

The wallet allows users to create a new account, log in, and sign transactions using the TSS protocol.
The mpc servers create a keypair each for each user.
Once the initiates a transaction the MPC servers will exchange public messages and then sign partial messages that are then sent independently to the main wallet backend where alas the transaction are coalecsed to be sent to the solana to be alas sent to solana network`;

export default learnHowItWorksContent; 