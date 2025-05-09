import React from 'react';
import { tagType, mainlogo } from '../icons';
import { daysLeft } from '../utils';

const FundCard = ({
  owner,
  title,
  description,
  target,
  deadline,
  amountCollected,
  image,
  handleClick,
}) => {
  const remainingDays = daysLeft(deadline);

  return (
    <div
      className="sm:w-[288px] w-full rounded-2xl bg-cardLight dark:bg-cardDark shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={image}
        alt="campaign"
        className="w-full h-[180px] object-cover rounded-t-2xl"
      />

      <div className="flex flex-col p-4">
        <div className="flex flex-row items-center mb-3">
          <img src={tagType} alt="tag" className="w-4 h-4 object-contain" />
          <p className="ml-2 text-xs text-[#808191] font-epilogue">Education</p>
        </div>

        <h3 className="text-lg font-semibold font-epilogue text-textLight dark:text-textDark truncate">
          {title}
        </h3>
        <p className="mt-1 text-sm text-[#808191] truncate">
          {description}
        </p>

        <div className="flex justify-between mt-4 gap-2">
          <div className="flex flex-col">
            <h4 className="text-sm font-semibold text-[#b2b3bd]">
              {amountCollected}
            </h4>
            <p className="text-xs text-[#808191] truncate">
              Raised of {target}
            </p>
          </div>

          <div className="flex flex-col">
            <h4 className="text-sm font-semibold text-[#b2b3bd]">
              {remainingDays}
            </h4>
            <p className="text-xs text-[#808191]">Days Left</p>
          </div>
        </div>

        <div className="flex items-center mt-4 gap-3">
          <div className="w-[30px] h-[30px] rounded-full bg-[#13131a] flex items-center justify-center">
            <img
              src={mainlogo}
              alt="user"
              className="w-1/2 h-1/2 object-contain"
            />
          </div>
          <p className="text-xs text-[#808191] truncate font-epilogue">
            by <span className="text-[#b2b3bd]">{owner}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FundCard;
