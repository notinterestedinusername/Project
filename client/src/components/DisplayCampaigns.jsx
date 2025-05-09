import React from 'react';
import { useNavigate } from 'react-router-dom';

import FundCard from './FundCard';
import { loader } from '../icons';

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();

  const handleNavigate = (campaign) => {
    navigate(`/campaign/${campaign.title}`, { state: campaign });
  };

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

        {!isLoading &&
          campaigns.length > 0 &&
          campaigns.map((campaign) => (
            <FundCard
              key={`${campaign.owner}-${campaign.title}`}
              {...campaign}
              handleClick={() => handleNavigate(campaign)}
            />
          ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
