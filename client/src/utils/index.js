export const daysLeft = (deadline) => {
  const difference = new Date(deadline * 1000).getTime() - Date.now(); // ⬅️ convert to ms
  const remainingDays = difference / (1000 * 3600 * 24);
  return Math.max(0, Math.floor(remainingDays));
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

  