import mpcSetupImg from '../assets/mpc-setup.png';
import mpcSigningImg from '../assets/mpc-signing.png';

const learnHowItWorksContent = [
  {
    type: 'paragraph',
    text: `Shardo Wallet is built on a secure and open-source implementation of the Threshold Signature Scheme (TSS) protocol, available here: [TSS/MPC](https://github.com/ZenGo-X/solana-tss). It enables safe, decentralized transaction signing by leveraging Multiparty Computation (MPC).`
  },
  {
    type: 'image',
    src: mpcSetupImg,
    alt: 'MPC Setup Diagram',
    description: 'Diagram showing how two MPC servers collaboratively generate a distributed keypair for the user during account setup.'
  },
  {
    type: 'paragraph',
    text: `With Shardo, users can easily create a new account, log in, and sign Solana transactions without ever handling private keys directly. The wallet coordinates two MPC servers that work together to manage and sign transactions using the TSS protocol.`
  },
  {
    type: 'paragraph',
    text: `During account setup, the MPC servers generate a cryptographic keypair for the user in a distributed manner. When the user initiates a transaction, both servers independently exchange public data, compute partial signatures, and send them to the wallet backend.`
  },
  {
    type: 'image',
    src: mpcSigningImg,
    alt: 'MPC Signing Flow',
    description: 'Illustration of the transaction signing process, where each MPC server computes a partial signature and the backend combines them for a valid Solana transaction.'
  },
  {
    type: 'paragraph',
    text: `The backend then combines these partial signatures to produce a valid Solana transaction, which is submitted to the blockchain for processing. This approach keeps the user's private key material distributed and secure—never stored in one place—while completely abstracting away the complexity of key management.`
  },
  {
    type: 'paragraph',
    text: `Shardo ensures security, privacy, and ease of use, letting users focus on what matters without worrying about seed phrases or private key storage.`
  }
];

export default learnHowItWorksContent;
