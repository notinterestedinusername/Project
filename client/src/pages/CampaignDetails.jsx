import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAddress, ConnectWallet } from '@thirdweb-dev/react';
import { daysLeft, calculateBarPercentage } from '../utils';
import { useStateContext } from '../context';
import { ethers } from 'ethers';

const CampaignDetails = () => {
  const { pId } = useParams();
  const { 
    address,
    contract,
    getCampaign, 
    getCampaignStatus, 
    getDonorDetails,
    donate,
    closeCampaign,
    extendCampaignDeadline,
    releaseCampaignFunds
  } = useStateContext();

  const [campaign, setCampaign] = useState(null);
  const [status, setStatus] = useState('');
  const [donors, setDonors] = useState([]);
  //const [donatedAmount, setDonatedAmount] = useState('0');
  const [amount, setAmount] = useState('');
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [newDeadline, setNewDeadline] = useState('');
  const [deadlineError, setDeadlineError] = useState('');
  

  const fetchCampaignDetails = async () => {
    try {
      const campaign = await getCampaign(pId);
      const campaignStatus = await getCampaignStatus(pId);
      const donors = await getDonorDetails(pId);
      //const userDonatedAmount = await getDonatedAmount(pId);

      const formattedCampaign = {
        ...campaign,
        goal: ethers.utils.formatEther(campaign.goal),
        raised: ethers.utils.formatEther(campaign.raised),
      };
      console.log("Donors:", donors);
      const formattedDonors = donors.map(({donor, amount}) => ({
        donor,
        amount,
      }));

    setCampaign(formattedCampaign);
    setStatus(campaignStatus);
    setDonors(formattedDonors);
      //setDonatedAmount(userDonatedAmount || '0');
    } catch (error) {
      console.error('Failed to fetch campaign details', error);
    }
  };
  
  useEffect(() => {
    if (contract && pId) {
      fetchCampaignDetails();
    }
  }, [address, contract, pId]);

  const handleDonate = async () => {
    if (!address) {
      alert('Please connect your wallet');
      return;
    }
    try {
      await donate(pId, amount);
      // Refresh campaign details
      fetchCampaignDetails();
      setAmount('');
    } catch (error) {
      console.error('Donation failed', error);
    }
  };

  const handleExtendDeadline = async () => {
    if (!newDeadline) {
      setDeadlineError('Please select a new deadline');
      return;
    }

    const newDeadlineTimestamp = Math.floor(new Date(newDeadline).getTime() / 1000);
    
    try {
      await extendCampaignDeadline(pId, newDeadlineTimestamp);
      setIsExtendModalOpen(false);
      // Refresh campaign details
      fetchCampaignDetails();
    } catch (error) {
      console.error('Deadline extension failed', error);
      setDeadlineError('Failed to extend deadline');
    }
  };

  const handleCloseCampaign = async () => {
    try {
      await closeCampaign(pId);
      // Refresh campaign details
      fetchCampaignDetails();
    } catch (error) {
      console.error('Closing campaign failed', error);
    }
  };

  const handleReleaseFunds = async () => {
    try {
      await releaseCampaignFunds(pId);
      // Refresh campaign details
      fetchCampaignDetails();
    } catch (error) {
      console.error('Releasing funds failed', error);
    }
  };

  if (!campaign) return <div className="text-center py-10">Loading...</div>;
  const remainingDays = daysLeft(campaign.deadline);
  const isCreator = address === campaign.creator;
  const isActiveCampaign = status === 'Active';
  const isClosed = status.includes('Closed');
  const isReleased = status === 'Released';

  return (
    <div className="max-w-4xl mx-auto p-6 font-epilogue">
      {/* Campaign Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">
          {campaign.title}
        </h1>
        <div className="flex space-x-4">
          {isCreator && isActiveCampaign && (
            <button 
              className="px-4 py-2 bg-light-accentGreen text-white rounded-lg hover:opacity-90 transition-opacity"
              onClick={() => setIsExtendModalOpen(true)}
            >
              Edit
            </button>
          )}
          <button 
            className={`px-4 py-2 rounded-lg transition-all ${
              isClosed || isReleased 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
            onClick={handleCloseCampaign}
            disabled={isClosed || isReleased}
          >
            Close
          </button>
        </div>
      </div>

      {/* Campaign Status */}
      <div className="bg-light-card dark:bg-dark-card rounded-lg p-6 mb-6 shadow-secondary">
        <div className="flex justify-between mb-4 text-light-text dark:text-dark-text">
          <span>Status: {status}</span>
          <span>Days Left: {remainingDays}</span>
          <span>
            Raised: {campaign.raised} / {campaign.goal} ETH
          </span>
          <span>Total Donors: {donors.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-light-accentGreen h-2.5 rounded-full" 
            style={{ 
              width: `${calculateBarPercentage(campaign.goal, campaign.raised)}%` 
            }}
          ></div>
        </div>
      </div>

      {/* Campaign Details Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Creator Section */}
        <div className="bg-light-card dark:bg-dark-card rounded-lg p-6 shadow-secondary">
          <h3 className="text-xl font-semibold mb-4">Creator</h3>
          <div className="flex justify-between items-center">
            <span className="truncate max-w-[200px]">{campaign.creator}</span>
            {isCreator && isClosed && !isReleased && (
              <button 
                className="px-4 py-2 bg-light-accentBlue text-white rounded-lg hover:opacity-90"
                onClick={handleReleaseFunds}
              >
                Withdraw
              </button>
            )}
          </div>
        </div>

        {/* Donate Section */}
        <div className="bg-light-card dark:bg-dark-card rounded-lg p-6 shadow-secondary">
          <h3 className="text-xl font-semibold mb-4">Donate to Campaign</h3>
          {!address ? (
            <div className="w-full flex justify-center">
              <ConnectWallet 
                theme="dark"
                btnTitle="Connect Wallet"
                className="w-full"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <input 
                type="number" 
                placeholder="Enter ETH"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!isActiveCampaign}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accentBlue"
              />
              <button 
                className={`w-full py-2 rounded-lg transition-all ${
                  (!isActiveCampaign || isClosed || amount <= 0)
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-light-accentBlue text-white hover:opacity-90'
                }`}
                onClick={handleDonate}
                disabled={!isActiveCampaign || isClosed || amount <= 0}
              >
                {isClosed ? 'Campaign Closed' : 'Donate'}
              </button>
            </div>
          )}
        </div>

        {/* Story Section */}
        <div className="bg-light-card dark:bg-dark-card rounded-lg p-6 shadow-secondary md:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Story</h3>
          <p className="text-light-text dark:text-dark-text">{campaign.description}</p>
          {campaign.img && (
            <img 
              src={campaign.img} 
              alt="Campaign" 
              className="mt-4 w-full h-auto rounded-lg object-cover"
            />
          )}
          {campaign.video && (
            <video 
              src={campaign.video} 
              controls 
              className="mt-4 w-full rounded-lg"
            />
          )}
        </div>

        {/* Donors Section */}
        <div className="bg-light-card dark:bg-dark-card rounded-lg p-6 shadow-secondary md:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Donors</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Address</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {donors.map((donor, index) => (
                  <tr key={index} className="border-b last:border-b-0">
                    <td className="py-2 truncate max-w-[200px]">{donor.donor}</td>
                    <td className="py-2 text-right">{donor.amount} ETH</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Extend Deadline Modal */}
      {isExtendModalOpen && isCreator && isActiveCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-dark-card rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Extend Deadline of Your Campaign</h2>
            <div className="mb-4">
              <label className="block mb-2">Select New Deadline</label>
              <input 
                type="date" 
                value={newDeadline}
                onChange={(e) => {
                  setNewDeadline(e.target.value);
                  setDeadlineError('');
                }}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-light-accentBlue"
              />
              {deadlineError && (
                <p className="text-red-500 mt-2">{deadlineError}</p>
              )}
            </div>
            <div className="flex justify-between">
              <button 
                onClick={handleExtendDeadline}
                disabled={campaign.extended}
                className={`px-4 py-2 rounded-lg ${
                  campaign.extended 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-light-accentBlue text-white hover:opacity-90'
                }`}
              >
                Update
              </button>
              <button 
                onClick={() => setIsExtendModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetails;