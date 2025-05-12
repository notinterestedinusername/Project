import axios from 'axios';

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = import.meta.env.VITE_PINATA_SECRET_API_KEY;

export const uploadFileToPinata = async (file) => {
  if(!file || !(file instanceof File)) {
    throw new Error('Invalid file provided');
  }
  
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const data = new FormData();
  data.append('file', file);

  try {
    const res = await axios.post(url, data, {
      maxContentLength: "Infinity",
      headers: {
        'Content-Type': `multipart/form-data`,
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });

    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  } catch (error) {
    console.error('Pinata upload failed:', error);
    throw new Error('Failed to upload file to Pinata');
  }
};

export const daysLeft = (deadline) => {
  const deadlineDate = new Date(deadline * 1000); // convert UNIX to Date
  const now = new Date(); // current Date
  const timeDiff = deadlineDate.getTime() - now.getTime(); // milliseconds left
  const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // full days
  return Math.max(0, dayDiff); // never negative
};

export const calculateBarPercentage = (goal, raisedAmount) => {
  if (goal === 0) return 0;
  return Math.round((raisedAmount * 100) / goal);
};

export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.onload = () => callback(true);
  img.onerror = () => callback(false);
  img.src = url;
};
