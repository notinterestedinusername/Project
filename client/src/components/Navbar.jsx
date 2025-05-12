import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../context';
import { mainlogo, search, profile } from '../icons';
import { useAddress, ConnectWallet } from '@thirdweb-dev/react';

const Navbar = () => {
  const navigate = useNavigate();
  //const { connect, isConnected } = useStateContext();
  const address = useAddress();
  //console.log(address);

  return (
    <nav className="fixed top-0 h-24 left-0 w-full flex items-center justify-between px-7 py-3 bg-light-background dark:bg-dark-background border-b border-gray-300 dark:border-gray-700 z-50 transition-all">
      {/* Left Section: Logo + Name */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <img src={mainlogo} alt="logo" className="w-14 h-14 object-contain" />
        <span className="text-[30px] font-bold text-light-text dark:text-dark-text">crypDan</span>
      </div>

      {/* Center: Search bar 
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
      */}

      {/* Right Section: Buttons */}
      <div className="flex items-center gap-5">
        {/* About Us */}
        <button
          onClick={() => navigate('/about')}
          className="text-[20px] px-6 py-4 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-cardAlt transition text-sm"
        >
          About Us
        </button>

        {/* Start Campaign (only visible if connected) */}
        {address && (
          <button
            onClick={() => navigate('/create-campaign')}
            className="font-semibold bg-light-accentBlue dark:bg-light-accentGold text-dark-text dark:text-light-text border border-gray-300 dark:border-gray-600 text-sm px-4 py-4 rounded-lg transition"
          >
            Create a Campaign
          </button>
        )}
        
				  <ConnectWallet />
        

        {/* Profile Icon 
        <button
          onClick={() => navigate('/profile')}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-cardAlt transition"
        >
          <img src={profile} alt="profile" className="w-6 h-6" />
        </button>
        */}

      </div>
    </nav>
  );
};

export default Navbar;
