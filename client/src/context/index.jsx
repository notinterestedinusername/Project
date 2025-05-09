import React, { createContext, useContext, useState } from 'react';
import { useAddress, useContract, useContractWrite, useConnect, useDisconnect, useConnectionStatus, metamaskWallet } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
//import { useActiveWallet, useDisconnect, useWalletAddress } from '@thirdweb-dev/react';
//import { useContract, useContractWrite } from 'thirdweb';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract('0x487Be678dd11a315e18Af16D08f95C939B694D19');
  //const [isLoading, setIsLoading] = useState(false);

  const address = useAddress();
  const connect = useConnect();
  const disconnect = useDisconnect();
  const isConnected = useConnectionStatus() === "connected";
  const connectWithMetamask = () => connect(metamaskWallet());

  // Create campaign
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');
  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
        args: [
          form.title,
          form.description,
          form.target,
          Math.floor(new Date(form.deadline).getTime() / 1000),
          form.image,
        ]
      });
      console.log("Campaign published", data);
    } catch (error) {
      console.error("Failed to publish campaign", error);
    }
  };

  // Get all campaigns
  const getAllCampaigns = async () => {
    try {
      const campaigns = await contract.call('getAllCampaigns');
      return campaigns.map((c, i) => ({
        creator: c.creator,
        title: c.title,
        description: c.description,
        goal: ethers.utils.formatEther(c.goal.toString()),
        raised: ethers.utils.formatEther(c.raised.toString()),
        deadline: c.deadline.toNumber(),
        status: c.status,
        goalReached: c.goalReached,
        extended: c.extended,
        img: c.img,
        pId: i + 1
      }));
    } catch (error) {
      console.error("Failed to fetch campaigns", error);
    }
  };

  // Get user-created campaigns
  const getUserCampaigns = async () => {
    const all = await getAllCampaigns();
    return all.filter((c) => c.creator.toLowerCase() === address.toLowerCase());
  };

  // Donate
  const donate = async (pId, amount) => {
    try {
      const data = await contract.call('donate', [pId], {
        value: ethers.utils.parseEther(amount)
      });
      return data;
    } catch (error) {
      console.error("Donation failed", error);
    }
  };

  // Check campaign goal status after deadline
  const checkCampaignGoal = async (pId) => {
    try {
      const data = await contract.call('checkGoal', [pId]);
      return data;
    } catch (error) {
      console.error("Goal check failed", error);
    }
  };

  // Extend deadline
  const extendCampaignDeadline = async (pId, newDeadlineTimestamp) => {
    try {
      const data = await contract.call('extendDeadline', [pId, newDeadlineTimestamp]);
      return data;
    } catch (error) {
      console.error("Deadline extension failed", error);
    }
  };

  // Release funds
  const releaseCampaignFunds = async (pId) => {
    try {
      const data = await contract.call('releaseFunds', [pId]);
      return data;
    } catch (error) {
      console.error("Fund release failed", error);
    }
  };

  // Get donations for a campaign
  const getCampaignDonors = async (pId) => {
    try {
      const donors = await contract.call('getCampaignDonors', [pId]);
      return donors;
    } catch (error) {
      console.error("Fetching donors failed", error);
    }
  };

  const getCampaign = async (pId) => {
    try {
      const campaign = await contract.call('getCampaign', [pId]);
      return campaign;
    } catch (error) {
      console.error("Fetching campaign failed",error);
    }
  }

  // Get total donated amount by current user for a campaign
  const getDonatedAmount = async (pId) => {
    try {
      const amount = await contract.call('getDonatedAmount', [pId, address]);
      return ethers.utils.formatEther(amount.toString());
    } catch (error) {
      console.error("Fetching donation amount failed", error);
    }
  };

  // Get campaigns the user donated to
  const getMyDonatedCampaigns = async () => {
    try {
      const ids = await contract.call('getMyDonatedCampaigns');
      return ids.map((id) => Number(id));
    } catch (error) {
      console.error("Fetching my donated campaigns failed", error);
    }
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect: connectWithMetamask,
        disconnect,
        isConnected,
        createCampaign: publishCampaign,
        getAllCampaigns,
        getUserCampaigns,
        donate,
        checkCampaignGoal,
        extendCampaignDeadline,
        releaseCampaignFunds,
        getCampaignDonors,
        getDonatedAmount,
        getCampaign,
        getMyDonatedCampaigns,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
