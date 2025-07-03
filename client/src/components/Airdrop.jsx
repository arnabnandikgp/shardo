import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Airdrop() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const handleAirdrop = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const resp = await axios.post("http://localhost:3000/api/v1/get-airdrop", {
        publicKey: user.publicKey,
        amount: selectedAmount,
      });
      setSuccess("Airdrop requested successfully!");
    } catch (err) {
      setError("Failed to request airdrop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', minWidth: '100vw', width: '100%', height: '100%', background: 'radial-gradient(circle at 60% 40%, #2d0036 0%, #18181b 100%)', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100%' }}>
        <div className="relative px-8 py-14" style={{ background: 'rgba(24,24,27,0.97)', boxShadow: '0 0 80px 10px #a259ff77', borderRadius: '3rem', width: '100%', maxWidth: '500px', textAlign: 'center', minHeight: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="max-w-lg mx-auto" style={{ width: '100%' }}>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-8 text-gray-200 sm:text-xl sm:leading-8" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h2 className="text-4xl font-extrabold mb-10 text-center" style={{ color: '#fff' }}>
                  Airdrop To
                </h2>
                {error && (
                  <div className="bg-red-50 p-4 rounded-md mb-4">
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 p-4 rounded-md mb-4">
                    <div className="text-sm text-green-700">{success}</div>
                  </div>
                )}
                <div style={{ width: '100%', padding: '0 1.2rem', boxSizing: 'border-box' }}>
                  <input
                    type="text"
                    value={user.publicKey}
                    readOnly
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
                      userSelect: 'all',
                    }}
                  />
                </div>
                <div style={{ width: '100%', padding: '0 1.2rem', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', marginBottom: '2rem', width: '100%' }}>
                    {[0.5, 1, 2, 4].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setSelectedAmount(amt)}
                        style={{
                          padding: '0.8rem 1.6rem',
                          borderRadius: '1rem',
                          border: selectedAmount === amt ? '2px solid #a259ff' : '2px solid #222',
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          background: selectedAmount === amt ? '#a259ff' : '#18181b',
                          color: selectedAmount === amt ? '#fff' : '#a259ff',
                          boxShadow: selectedAmount === amt ? '0 2px 16px #a259ff44' : 'none',
                          cursor: 'pointer',
                          transition: 'background 0.2s, color 0.2s, border 0.2s',
                          minWidth: '70px',
                        }}
                      >
                        {amt} SOL
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem', width: '100%' }}>
                  <button
                    type="button"
                    onClick={handleAirdrop}
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
                    {loading ? "Requesting..." : "Request Airdrop"}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Airdrop; 