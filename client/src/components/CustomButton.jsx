import React from 'react';

const CustomButton = ({ btnType, title, handleClick, styles }) => {
  return (
    <button
        type={btnType}
        className={`font-epilogue font-semibold text-[16px] leading-[26px] text-light-text dark:text-dark-text min-h-[52px] px-4 rounded-[10px] ${styles}`}
        onClick={handleClick}
    >
        {title}

    </button>
  )
};

export default CustomButton;