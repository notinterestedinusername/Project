import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../context';
import FundCard from './FundCard';
import { loader } from '../icons';

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();
  const { getCampaignDonors } = useStateContext();
  const [donorCounts, setDonorCounts] = useState();

  const handleNavigate = (campaign) => {
    navigate(`/campaign/${campaign.pId}`, { state: campaign });
  };

useEffect(() => {
  const fetchDonorsForAll = async () => {
    const counts = {};
    for (const campaign of campaigns) {
      const donors = await getCampaignDonors(campaign.pId);
      counts[campaign.pId] = donors || [];
    }
    setDonorCounts(counts);
  };

  if (campaigns.length > 0) fetchDonorsForAll();
}, [campaigns]);



  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-textLight dark:text-textDark text-left mb-4">
        {title} ({campaigns.length})
      </h1>

      <div className="flex flex-wrap gap-6">
        {isLoading && (
            <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
            )}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-medium text-[14px] text-[#818183]">
            No campaigns found.
          </p>
        )}

        {!isLoading && campaigns.length > 0 && campaigns.map((campaign) => {
            console.log(campaign);
            return (
            <FundCard
              key={campaign.pId}
              {...campaign}
              backers={(donorCounts?.[campaign.pId]?.length || 0)}
              handleClick={() => handleNavigate(campaign)}
            />
          )})}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
