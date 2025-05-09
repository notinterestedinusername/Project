import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import { useStateContext } from '../context';
import { calculateBarPercentage } from '../utils';
import Loader from '../components/Loader';

const CampaignDetails = () => {
  const { id } = useParams();
  const { contract, donate, getCampaign, getCampaignDonors } = useStateContext();

  const [campaign, setCampaign] = useState(null);
  const [donors, setDonors] = useState([]);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchDetails = async () => {
    const data = await getCampaign(id);
    setCampaign(data);
    const donorData = await getCampaignDonors(id);
    setDonors(donorData);
  };

  const handleDonate = async () => {
    setIsLoading(true);
    await donate(id, amount);
    setAmount('');
    await fetchDetails();
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) fetchDetails();
  }, [contract]);

  if (!campaign) return <Loader />;

  const formattedGoal = Number(ethers.utils.formatEther(campaign.goal));
  const formattedRaised = Number(ethers.utils.formatEther(campaign.raised));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>
      <img src={campaign.image} alt="campaign" className="w-full h-64 object-cover rounded-xl mb-6" />
      <p className="text-gray-700 dark:text-gray-300 mb-6">{campaign.description}</p>

      <div className="mb-6">
        <div className="w-full bg-gray-300 dark:bg-gray-700 h-4 rounded-full">
          <div
            className="h-4 bg-green-600 rounded-full"
            style={{ width: `${calculateBarPercentage(formattedGoal, formattedRaised)}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Raised: {formattedRaised} ETH</span>
          <span>Goal: {formattedGoal} ETH</span>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Make a Donation</h2>
        <input
          type="number"
          placeholder="Amount in ETH"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2 border rounded w-full dark:bg-gray-800 dark:text-white"
        />
        <button
          onClick={handleDonate}
          disabled={isLoading}
          className="mt-3 w-full bg-accentBlue text-white py-2 rounded hover:opacity-90 transition"
        >
          {isLoading ? 'Processing...' : 'Donate'}
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Donors</h2>
        {donors.length > 0 ? (
          <ul className="space-y-2">
            {donors.map((donor, index) => (
              <li key={index} className="flex justify-between text-sm bg-cardLight dark:bg-cardDark p-2 rounded">
                <span className="truncate">{donor.donor}</span>
                <span>{ethers.utils.formatEther(donor.amount)} ETH</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No donors yet. Be the first!</p>
        )}
      </div>
    </div>
  );
};

export default CampaignDetails;
