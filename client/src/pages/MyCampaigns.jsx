import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context';
import { Wallet } from 'lucide-react';
import { ConnectWallet } from '@thirdweb-dev/react';

const MyCampaigns = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getUserCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getUserCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract && address) {
      fetchCampaigns();
    } else {
      setIsLoading(false);
    }
  }, [address, contract]);

  if (!address) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <div className="text-center max-w-md p-8 bg-light-card dark:bg-dark-card rounded-xl shadow-lg">
          <Wallet className="w-16 h-16 mx-auto mb-4 text-[#1dc071]" />
          <h2 className="text-2xl font-bold mb-2 text-textLight dark:text-textDark">Connect Your Wallet</h2>
          <p className="text-[#808191] mb-6">
            Connect your wallet to view and manage your created campaigns.
          </p>
          <ConnectWallet />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 sm:p-8">
      {campaigns && campaigns.length > 0 ? (
        <DisplayCampaigns
          title="My Campaigns"
          isLoading={isLoading}
          campaigns={campaigns}
        />
      ) : !isLoading && (
        <div className="flex flex-col items-center justify-center p-8 bg-light-card dark:bg-dark-card rounded-xl">
          <h2 className="font-epilogue font-semibold text-xl text-textLight dark:text-textDark mb-2">
            No Campaigns Created
          </h2>
          <p className="text-[#808191] text-center mb-6">
            You haven't created any campaigns yet. Start a new campaign to raise funds for your cause.
          </p>
          <button
            onClick={() => navigate('/create-campaign')}
            className="bg-[#1dc071] hover:bg-[#13a55c] text-white py-2 px-6 rounded-full font-medium transition-colors"
          >
            Start your Campaign
          </button>
        </div>
      )}
    </div>
  );
};

export default MyCampaigns;