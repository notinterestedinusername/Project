import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../src/index.css'; // Ensure this line is there
import { ethers } from 'ethers';

const Home = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState(null); // To store the wallet address

  useEffect(() => {
    // Check if wallet is connected on page load
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAddress(accounts[0]); // Set the first account address
        }
      }
    };
    
    checkWalletConnection();
  }, []);

  const handleConnectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Prompt to connect wallet
      const accounts = await provider.listAccounts();
      setAddress(accounts[0]); // Set the connected wallet address
    } else {
      alert("Please install MetaMask to connect your wallet.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-text">
      {/* Main Content */}
      <div className="flex-grow w-full flex flex-col items-center bg-animated">
        {/* Hero Section */}
        <section className="w-full bg-accentBlue py-16 px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Empowering Change Through Crypto Crowdfunding</h1>
          <p className="text-lg mb-8">Start or support blockchain-powered campaigns securely and transparently.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            {address ? (
              <button
                onClick={() => navigate("/create-campaign")}
                className="bg-cardLight text-black py-2 px-4 rounded hover:bg-gray-300"
              >
                Start a Campaign
              </button>
            ) : (
              <button
                onClick={handleConnectWallet}
                className="bg-cardLight text-black py-2 px-4 rounded hover:bg-gray-300"
              >
                Connect Wallet
              </button>
            )}
            <button
              onClick={() => navigate("/campaigns")}
              className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
            >
              Explore Campaigns →
            </button>
          </div>
        </section>

        {/* Discover Campaigns Section */}
        <section className="w-full bg-green-100 py-12 px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Discover Campaigns</h2>
            <button
              onClick={() => navigate("/campaigns")}
              className="bg-white border border-black text-black py-2 px-4 rounded hover:bg-gray-100"
            >
              View All →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card p-4 rounded-lg shadow-md h-40">Campaign Card 1</div>
            <div className="bg-card p-4 rounded-lg shadow-md h-40">Campaign Card 2</div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="w-full bg-blue-400 py-12 px-4 text-white">
          <h2 className="text-3xl font-bold mb-8">How it Works?</h2>
          <div className="space-y-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white"></div>
                <div>
                  <h3 className="text-lg font-semibold">Step {step}</h3>
                  <p className="text-sm">Brief explanation of what happens in this step.</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
