import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import solanaLogo from '../assets/solanaLogoMark.svg';
// import Header from "./Header";

// const connection = new Connection("https://api.devnet.solana.com/");

function truncateKey(key) {
  if (!key || key.length < 8) return key;
  return key.slice(0, 4) + '...' + key.slice(-4);
}

function Dashboard() {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { logout, user, token } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const handleCopy = () => {
    if (user && user.publicKey) {
      navigator.clipboard.writeText(user.publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
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
    } catch {
      throw new Error("Failed to send transaction");
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
    } catch {
      setError("Failed to send transaction");
    } finally {
      setLoading(false);
    }
  };

  // Fetch balance function
  const fetchBalance = async () => {
    if (!user || !user.publicKey) return;
    setBalanceLoading(true);
    setBalanceError("");
    try {
      const res = await axios.get("http://localhost:3000/api/v1/get-payment-info", {
        params: { publicKey: user.publicKey },
      });
      setBalance(res.data.costInSol ?? 0);
    } catch (err) {
      setBalanceError(err.message || "Failed to fetch balance");
    } finally {
      setBalanceLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    // eslint-disable-next-line
  }, [user && user.publicKey]);

  return (
    <div style={{ minHeight: '100vh', minWidth: '100vw', width: '100%', height: '100%', background: 'radial-gradient(circle at 60% 40%, #2d0036 0%, #18181b 100%)', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* <Header /> */}
      {/* Public Key Display */}
      {user && user.publicKey && (
        <div style={{ position: 'absolute', top: 90, right: 48, zIndex: 20, display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(24,24,27,0.97)', borderRadius: '1rem', padding: '0.5rem 1.2rem', boxShadow: '0 0 16px #a259ff44', fontSize: '1.25rem', color: '#bbb' }}>
          <img src={solanaLogo} alt="Solana" style={{ width: 22, height: 22, marginRight: 6, verticalAlign: 'middle' }} />
          <span style={{ fontFamily: 'monospace', fontWeight: 500 }}>{truncateKey(user.publicKey)}</span>
          <button onClick={handleCopy} style={{ background: 'none', border: 'none', color: '#a259ff', cursor: 'pointer', fontSize: '1.2rem', padding: 0, marginLeft: '0.2rem' }} title="Copy">
            {copied ? '✓' : <svg style={{ verticalAlign: 'middle' }} width="20" height="20" fill="none" stroke="#a259ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6"/></svg>}
          </button>
          {/* Info bubble */}
          <div
            style={{ position: 'relative', display: 'inline-block', marginLeft: '0.5rem' }}
            onMouseEnter={() => setShowInfo(true)}
            onMouseLeave={() => setShowInfo(false)}
          >
            <button
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: '#a259ff',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px #a259ff33',
                padding: 0,
              }}
              tabIndex={0}
              aria-label="Info"
            >
              i
            </button>
            {showInfo && (
              <div
                style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  background: '#fff',
                  color: '#222',
                  borderRadius: '0.5rem',
                  boxShadow: '0 2px 16px #0002',
                  padding: '0.7em 1em',
                  fontSize: '0.95rem',
                  minWidth: 240,
                  zIndex: 100,
                  whiteSpace: 'normal',
                  textAlign: 'left',
                  pointerEvents: 'auto',
                }}
              >
                This key is aggregated from the 2 different public key components, click{' '}
                <Link to="/?section=learn-how-it-works" style={{ color: '#a259ff', textDecoration: 'underline', fontWeight: 600 }}>
                  here
                </Link>{' '}
                to learn more.
              </div>
            )}
          </div>
        </div>
      )}
      {/* Balance Field - Top Left */}
      {user && user.publicKey && (
        <div style={{
          position: 'absolute',
          top: 90,
          left: 48,
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.7rem',
            background: 'rgba(24,24,27,0.97)',
            borderRadius: '1rem',
            padding: '0.5rem 1.2rem 0.5rem 1.1rem',
            boxShadow: '0 0 16px #a259ff44',
            fontSize: '1.35rem',
            color: '#fff',
            minWidth: 220,
            fontFamily: 'monospace',
            fontWeight: 500,
          }}>
            <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '1.25rem', color: '#fff', marginRight: 8 }}>balance</span>
            <div style={{ width: 2, height: 28, background: '#444', margin: '0 10px 0 0', borderRadius: 2 }} />
            <span style={{ fontFamily: 'monospace', fontSize: '1.35rem', color: '#fff', minWidth: 80, textAlign: 'right', display: 'inline-block', fontWeight: 700 }}>
              {balanceLoading ? '...' : balanceError ? 'Err' : balance !== null ? balance : '--'}
            </span>
            <span style={{ fontSize: '1.3rem', color: '#fff', marginLeft: 2, marginRight: 2, fontWeight: 600 }}>◎</span>
            <button onClick={fetchBalance} style={{
              background: 'none',
              border: 'none',
              marginLeft: 6,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 0,
              outline: 'none',
            }} title="Refresh Balance">
              {/* Modern refresh SVG icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.05 11a9 9 0 1 1 2.13 5.66"/><polyline points="4 19 4 11 12 11"/></svg>
            </button>
          </div>
        </div>
      )}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100%' }}>
        <div className="relative px-8 py-14" style={{ background: 'rgba(24,24,27,0.97)', boxShadow: '0 0 80px 10px #a259ff77', borderRadius: '3rem', width: '100%', maxWidth: '500px', textAlign: 'center', minHeight: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="max-w-lg mx-auto" style={{ width: '100%' }}>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-8 text-gray-200 sm:text-xl sm:leading-8" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h2 className="text-4xl font-extrabold mb-10 text-center" style={{ color: '#fff' }}>
                  Send SOL
                </h2>
                {error && (
                  <div className="bg-red-50 p-4 rounded-md mb-4">
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6" style={{ width: '100%', maxWidth: '440px', margin: '0 auto', padding: '0 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Recipient Address"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1.1rem 1.2rem',
                      border: 'none',
                      borderRadius: '1rem',
                      fontSize: '1.25rem',
                      background: '#18181b',
                      color: '#fff',
                      boxShadow: '0 0 0 2px #a259ff33',
                      marginBottom: '1.2rem',
                      outline: 'none',
                      transition: 'box-shadow 0.2s',
                      boxSizing: 'border-box',
                    }}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Amount in SOL"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1.1rem 1.2rem',
                      border: 'none',
                      borderRadius: '1rem',
                      fontSize: '1.25rem',
                      background: '#18181b',
                      color: '#fff',
                      boxShadow: '0 0 0 2px #a259ff33',
                      marginBottom: '1.2rem',
                      outline: 'none',
                      transition: 'box-shadow 0.2s',
                      boxSizing: 'border-box',
                    }}
                    required
                    min="0"
                    step="0.000000001"
                  />
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem', width: '100%' }}>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        padding: '0.9rem 2.5rem',
                        borderRadius: '1rem',
                        border: 'none',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        background: '#a259ff',
                        color: '#fff',
                        boxShadow: '0 2px 16px #a259ff44',
                        cursor: 'pointer',
                        transition: 'background 0.2s, color 0.2s',
                        minWidth: '140px',
                      }}
                    >
                      {loading ? "Sending..." : "Send SOL"}
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      style={{
                        padding: '0.9rem 2.5rem',
                        borderRadius: '1rem',
                        border: 'none',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        background: '#18181b',
                        color: '#fff',
                        boxShadow: '0 2px 16px #a259ff44',
                        cursor: 'pointer',
                        transition: 'background 0.2s, color 0.2s',
                        minWidth: '140px',
                      }}
                    >
                      Logout
                    </button>
                  </div>
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
