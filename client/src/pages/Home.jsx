import { useState, useEffect } from "react";
import { useAddress, useContract, ConnectWallet } from "@thirdweb-dev/react";
import { ArrowRight, Layers, BookOpen, Zap, Shield } from "lucide-react";
import { mainlogo } from '../icons';
import { useNavigate } from 'react-router-dom';

// Main Component
const Home = () => {
  const address = useAddress();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-epilogue">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 to-purple-900 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/api/placeholder/1200/600')] bg-cover bg-center"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                Decentralized Crowdfunding for a Better World
              </h1>
              <p className="mt-6 text-xl text-blue-100 max-w-xl">
                crypDan helps you fund meaningful projects using blockchain technology - ensuring transparency, security, and direct support for causes you care about.
              </p>
              <div className="mt-10">
                <button 
                    onClick={() => navigate('/all-campaigns')}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all flex items-center"
                  >
                    Explore Campaigns
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-5">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white border-opacity-20">
                <div className="text-center">
                  <Layers className="mx-auto h-12 w-12 text-blue-300" />
                  <h3 className="mt-2 text-xl font-medium text-white">Blockchain-Powered Donations</h3>
                  <p className="mt-3 text-blue-200">
                    Transparent, secure, and direct funding with Ethereum blockchain technology
                  </p>
                </div>
                <div className="mt-8 flex justify-center">
                  <div className="inline-flex rounded-full bg-blue-900 bg-opacity-40 px-4 py-2 text-sm text-blue-200">
                    <Shield className="h-4 w-4 mr-2"/> Secure & Transparent
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How crypDan Works?</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Transparent and secure crowdfunding on the Ethereum blockchain in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-xl shadow-md p-8 relative">
              <div className="h-12 w-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mb-6">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Connect</h3>
              <p className="text-gray-600 mb-6">
                Connect your MetaMask wallet securely with just a click. Your wallet is your identity on crypDan.
              </p>
              <div className="absolute bottom-8 right-8 text-blue-500 opacity-10">
                <Zap className="h-16 w-16" />
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white rounded-xl shadow-md p-8 relative">
              <div className="h-12 w-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mb-6">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Create or Donate</h3>
              <p className="text-gray-600 mb-6">
                Start your own campaign with a few steps or support existing ones by donating ETH securely.
              </p>
              <div className="absolute bottom-8 right-8 text-blue-500 opacity-10">
                <BookOpen className="h-16 w-16" />
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white rounded-xl shadow-md p-8 relative">
              <div className="h-12 w-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mb-6">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Transparency</h3>
              <p className="text-gray-600 mb-6">
                All transactions are recorded on the blockchain, ensuring complete transparency and accountability.
              </p>
              <div className="absolute bottom-8 right-8 text-blue-500 opacity-10">
                <Shield className="h-16 w-16" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join the crypDan community today and help fund projects that matter.
          </p>
          {address ? (
            <button 
              onClick={() => navigate('/create-campaign')}
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
            >
              Start Your Campaign
            </button>
          ) : (
            <ConnectWallet 
              btnTitle="Connect Your Wallet to Begin!"
            />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <img src={mainlogo} className="w-12 h-12"/>
                <span className="text-xl font-bold text-white">crypDan</span>
              </div>
              <p className="mt-4 text-sm">
                Decentralized crowdfunding platform powered by Ethereum blockchain.
              </p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><a href="/" className="hover:text-white transition-colors">Discover</a></li>
                <li><a href="/" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="/" className="hover:text-white transition-colors">Create Campaign</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-center">
            <p>© {new Date().getFullYear()} crypDan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default Home