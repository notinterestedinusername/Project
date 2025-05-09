import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../context';
import { mainlogo, search, profile } from '../icons'; // Update paths accordingly
import { useAddress } from '@thirdweb-dev/react';

const Navbar = () => {
  const navigate = useNavigate();
  const { connect, isConnected } = useStateContext();
  const address = useAddress();
  console.log(address);

  return (
    <nav className="fixed top-0 h-20 left-0 w-full flex items-center justify-between px-6 py-3 bg-light-background dark:bg-dark-background border-b border-gray-300 dark:border-gray-700 z-50 transition-all">
      
      {/* Left Section: Logo + Name */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <img src={mainlogo} alt="logo" className="w-8 h-8 object-contain" />
        <span className="text-xl font-bold text-light-text dark:text-dark-text">crypDan</span>
      </div>

      {/* Center: Search bar */}
      <div className="flex-1 mx-6 max-w-[300px] hidden md:flex">
        <div className="flex items-center justify-between w-full bg-light-card dark:bg-dark-cardAlt rounded-full h-[42px] shadow-sm pl-4 pr-1">
          <input
            type="text"
            placeholder="Search for campaigns..."
            className="flex-1 text-sm bg-transparent text-light-text dark:text-dark-text placeholder:text-gray-500 focus:outline-none"
          />
          <div className="w-[36px] h-[36px] flex items-center justify-center rounded-full bg-light-accentGreen dark:bg-light-accentGreen cursor-pointer">
            <img src={search} alt="search" className="w-4 h-4 opacity-90" />
          </div>
        </div>
      </div>

      {/* Right Section: Buttons */}
      <div className="flex items-center gap-3">
        {/* Start Campaign (only visible if connected) */}
        {isConnected && (
          <button
            onClick={() => navigate('/create-campaign')}
            className="bg-light-accentBlue dark:bg-light-accentGold text-dark-text dark:text-light-text border border-gray-300 dark:border-gray-600 text-sm px-4 py-2 rounded-lg transition"
          >
            Create a Campaign
          </button>
        )}
          {/*
          <ConnectButton
						clientId={clientId}
						appMetadata={{
							name: "Example app",
							url: "https://example.com",
						}}
          />
          */}
				
        
        {!isConnected ? (
          <button
            onClick={connect}
            className="bg-light-accentBlue hover:bg-blue-700 text-dark-text text-sm px-4 py-2 rounded-lg transition"
          >
          Connect Wallet
          </button>
        ) : (
          <div
            className="bg-light-card dark:bg-dark-cardAlt px-3 py-2 rounded-lg text-sm dark:text-dark-text border border-gray-300 dark:border-gray-600 truncate max-w-[150px] cursor-default"
            title={address}
          >
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        )}
        


        {/* Profile Icon */}
        <button
          onClick={() => navigate('/profile')}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-cardAlt transition"
        >
          <img src={profile} alt="profile" className="w-6 h-6" />
        </button>

        {/* About Us */}
        <button
          onClick={() => navigate('/about')}
          className="px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-cardAlt transition text-sm"
        >
          About Us
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
