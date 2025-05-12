import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Home, AllCampaigns, MyCampaigns, CreateCampaign, CampaignDetails, SearchCampaign, Profile, About } from './pages';
import { Sidebar, Navbar } from './components';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Dynamically change margin-left based on sidebar expansion
  const marginLeft = isExpanded ? 'ml-56' : 'ml-14';

  return (
    <div className="bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text min-h-screen">
      {/* Navbar */}
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />

      <div className="relative sm:-8 p-4 flex flex-row">
        {/* Sidebar */}
        <div className="sm:flex hidden mr-10 relative">
          <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        </div>

        {/* Main Content Area */}
        <div className={`flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5 transition-all duration-300 ${marginLeft}`}>
          <div className="pt-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/all-campaigns" element={<AllCampaigns />} />
            <Route path="/my-campaigns" element={<MyCampaigns />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/campaign/:pId" element={<CampaignDetails />} />
            <Route path="/create-campaign" element={<CreateCampaign />} />
            <Route path="/search" element={<SearchCampaign />} />
            <Route path="/about" element={<About />} />
          </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
