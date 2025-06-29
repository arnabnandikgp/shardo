import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Transaction,
  Connection,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
  TransactionMessage,
} from "@solana/web3.js";
import axios from "axios";
// import Header from "./Header";

// const connection = new Connection("https://api.devnet.solana.com/");

function Dashboard() {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { logout, user, token } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const sendSol = async (amount) => {
    try {

      // const recipientPubkey = new PublicKey(recipientAddress);

      await axios.post(
        "http://localhost:3000/api/v1/txn/sign",
        { recipient: recipientAddress, amount: amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Public-Key": user.publicKey,
          },
        }
      );

      setRecipientAddress("");
      setAmount("");
      alert("Transaction sent successfully!");
    } catch (err) {
      throw new Error(err.message || "Failed to send transaction");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const amountInSol = parseFloat(amount);
      if (isNaN(amountInSol) || amountInSol <= 0) {
        throw new Error("Please enter a valid amount");
      }

      await sendSol(amountInSol);
    } catch (err) {
      setError(err.message || "Failed to send transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', minWidth: '100vw', width: '100%', height: '100%', background: 'radial-gradient(circle at 60% 40%, #2d0036 0%, #18181b 100%)', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* <Header /> */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100%' }}>
        <div className="relative px-4 py-10" style={{ background: 'rgba(24,24,27,0.95)', boxShadow: '0 0 40px #a259ff55', borderRadius: '2rem', width: '100%', maxWidth: '480px', textAlign: 'center' }}>
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-8 text-center">
                  Send SOL
                </h2>
                {error && (
                  <div className="bg-red-50 p-4 rounded-md mb-4">
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Recipient Address"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Amount in SOL"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      min="0"
                      step="0.000000001"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send SOL"}
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Logout
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
