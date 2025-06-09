import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import "./App.css";
import {
  Transaction,
  Connection,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import axios from "axios";

const fromPubkey = new PublicKey(
  "Hoamid9gD8dEgLrirgt3gNnAWhmxYe5LSKrJJUGGd4DA"
);

// my alchemy api url
// const connection = new Connection(
//   "https://solana-devnet.g.alchemy.com/v2/hFcItZcCi7sBqEK3tddTpMWbfSzpm6ae"
// );

const connection = new Connection(
  "https://api.devnet.solana.com/"
);

function App() {
  async function sendSol() {
    const ix = SystemProgram.transfer({
      fromPubkey: fromPubkey,
      toPubkey: new PublicKey("ABs9ZhEgHZbbXxP6FxxS8Gfu9sqrmXAokNoaxNXtoRt1"),
      lamports: LAMPORTS_PER_SOL * 1,
    });

    const tx = new Transaction().add(ix);
    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = fromPubkey;

    // convert the transaction to a bunch of bytes
    const serializedTx = tx.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });

    console.log(serializedTx);

    await axios.post("http://localhost:3000/api/v1/txn/sign", {
      message: serializedTx,
      retry: false,
    });
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
