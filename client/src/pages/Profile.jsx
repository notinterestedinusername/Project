import React, { useState, useEffect } from 'react';
import { useStateContext } from '../context';
import { useNavigate } from 'react-router-dom';
import DisplayCampaigns from '../components/DisplayCampaigns';
import { ethers } from 'ethers';
import { loader } from '../icons';
import { Wallet } from 'lucide-react';
import { ConnectWallet } from '@thirdweb-dev/react';

const Profile = () => {
  const navigate = useNavigate();
  const { 
    address, 
    getMyDonatedCampaigns, 
    getAllCampaigns, 
    getDonatedAmount,
    getCampaign
  } = useStateContext();
  
  const [isLoading, setIsLoading] = useState(true);
  const [donatedCampaigns, setDonatedCampaigns] = useState([]);
  const [totalDonated, setTotalDonated] = useState('0');

  const fetchDonatedCampaigns = async () => {
    setIsLoading(true);
    try {
      // Get IDs of campaigns the user has donated to
      const donatedCampaignIds = await getMyDonatedCampaigns();
      
      if (donatedCampaignIds && donatedCampaignIds.length > 0) {
        // Fetch all campaigns data
        const allCampaigns = await getAllCampaigns();
        
        // Filter campaigns by donated IDs
        const userDonatedCampaigns = allCampaigns.filter(
          campaign => donatedCampaignIds.includes(campaign.pId)
        );
        
        // Calculate total amount donated
        let total = ethers.BigNumber.from('0');
        
        // For each campaign, get how much this user donated
        const donationDetails = await Promise.all(
          userDonatedCampaigns.map(async (campaign) => {
            const donatedAmount = await getDonatedAmount(campaign.pId);
            const amountBN = ethers.utils.parseEther(donatedAmount || '0');
            total = total.add(amountBN);
            
            // Add the user's donation amount to each campaign object
            return {
              ...campaign,
              userDonation: donatedAmount
            };
          })
        );
        
        setDonatedCampaigns(donationDetails);
        setTotalDonated(ethers.utils.formatEther(total));
      } else {
        setDonatedCampaigns([]);
        setTotalDonated('0');
      }
    } catch (error) {
      console.error("Error fetching donated campaigns:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      fetchDonatedCampaigns();
    } else {
      setIsLoading(false);
    }
  }, [address]);

  if (!address) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <div className="text-center max-w-md p-8 bg-light-card dark:bg-dark-card rounded-xl shadow-lg">
          <Wallet className="w-16 h-16 mx-auto mb-4 text-[#1dc071]" />
          <h2 className="text-2xl font-bold mb-2 text-textLight dark:text-textDark">Connect Your Wallet</h2>
          <p className="text-[#808191] mb-6">
            Connect your wallet to view your donation history and profile information.
          </p>
          <ConnectWallet />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="font-epilogue font-bold text-2xl sm:text-3xl text-textLight dark:text-textDark mb-2">
          My Profile
        </h1>
        <p className="font-epilogue text-sm text-[#808191] mb-4">
          Address: {address && `${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
        </p>
        
        <div className="bg-light-card dark:bg-dark-card p-4 sm:p-6 rounded-xl shadow-md mb-8">
          <h2 className="font-epilogue font-semibold text-xl text-textLight dark:text-textDark mb-2">
            Donation Summary
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div>
              <p className="text-[#808191] text-sm">Total Donated</p>
              <p className="font-bold text-2xl text-textLight dark:text-textDark">
                {totalDonated} <span className="text-lg">ETH</span>
              </p>
            </div>
            <div className="sm:ml-8">
              <p className="text-[#808191] text-sm">Campaigns Supported</p>
              <p className="font-bold text-2xl text-textLight dark:text-textDark">
                {donatedCampaigns.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center my-12">
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        </div>
      ) : donatedCampaigns.length > 0 ? (
        <DisplayCampaigns 
          title="Campaigns You've Supported"
          isLoading={false}
          campaigns={donatedCampaigns}
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-8 bg-light-card dark:bg-dark-card rounded-xl">
          <h2 className="font-epilogue font-semibold text-xl text-textLight dark:text-textDark mb-2">
            No Donations Yet
          </h2>
          <p className="text-[#808191] text-center mb-6">
            You haven't donated to any campaigns yet. Explore active campaigns and support causes that matter to you.
          </p>
          <button
            onClick={() => navigate('/all-campaigns')}
            className="bg-[#1dc071] hover:bg-[#13a55c] text-white py-2 px-6 rounded-full font-medium transition-colors"
          >
            Explore Campaigns
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;