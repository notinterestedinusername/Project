import React from 'react';
import { mainlogo } from '../icons';
import { daysLeft, calculateBarPercentage } from '../utils';
import { Users, Clock } from 'lucide-react';

const FundCard = ({
  creator,
  title,
  description,
  goal,
  deadline,
  raised,
  img,
  handleClick,
  backers = 0, // default if not passed
}) => {
  const remainingDays = daysLeft(deadline);
  const progress = calculateBarPercentage(goal, raised);

  return (
    <div
      className="sm:w-[288px] w-full rounded-2xl bg-light-card dark:bg-dark-card shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      <div className="relative aspect-video">
        <img
          src={img || "/placeholder.svg"}
          alt={title}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="flex flex-col p-4 pt-3">
        <h3 className="text-lg font-semibold font-epilogue text-textLight dark:text-textDark line-clamp-1">
          {title}
        </h3>
        <p className="mt-1 text-sm text-[#808191] line-clamp-2">
          {description}
        </p>

        <div className="space-y-2 mt-4">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-[#b2b3bd]">{raised} ETH raised</span>
            <span className="text-xs text-[#808191]">{goal} ETH goal</span>
          </div>

          <div className="w-full bg-gray-300/30 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#1dc071] h-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-[#808191]">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{backers} backers</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{remainingDays} days left</span>
            </div>
          </div>
        </div>
      {/*
        <div className="flex items-center mt-4 gap-3">
          <div className="w-[30px] h-[30px] rounded-full bg-[#13131a] flex items-center justify-center">
            <img
              src={mainlogo}
              alt="user"
              className="w-1/2 h-1/2 object-contain"
            />
          </div>
          <p className="text-xs text-[#808191] truncate font-epilogue">
            by <span className="text-[#b2b3bd]">{creator}</span>
          </p>
        </div>
        */}
      </div>
    </div>
  );
};

export default FundCard;
