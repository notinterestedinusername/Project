import React from 'react';
import { loader } from '../icons';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-[rgba(0,0,0,0.6)] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        <p className="mt-5 font-epilogue font-bold text-[20px] text-white text-center">
          Transaction is in progress<br />Please wait...
        </p>
      </div>
    </div>
  );
};

export default Loader;
