//sidebar file
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { navlinks } from '../constants';
import ThemeToggle from './ThemeToggle';
import { Menu, X } from 'lucide-react';

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick, label }) => (
  <div
    className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-all duration-300
      ${isActive === name ? 'bg-gray-200 dark:bg-dark-card' : 'hover:bg-gray-200 dark:hover:bg-dark-cardAlt'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      ${styles}
    `}
    onClick={handleClick}
  >
    <div className="min-w-[32px] min-h-[32px] flex justify-center items-center">
      <img
        src={imgUrl}
        alt={name}
        className={`w-5 h-5 ${isActive !== name ? 'grayscale' : ''}`}
      />
    </div>
    {styles?.includes('expanded') && (
      <span className="text-sm font-medium whitespace-nowrap">{label}</span>
    )}
  </div>
);

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('');

  const sidebarWidth = isExpanded ? 'w-56' : 'w-14';

  useEffect(() => {
    const currentPath = location.pathname.split('/')[1] || 'home';
    const matched = navlinks.find(link => link.link.replace('/', '') === currentPath);

    if (matched) {
      setIsActive(matched.name);
    } else {
      setIsActive('');
    }
  }, [location]);


  return (
    <div className={`fixed top-24 left-0 bottom-0 w-auto z-40 flex flex-col justify-between py-6 px-2 
      overflow-y-auto bg-light-background dark:bg-dark-background border-r dark:border-gray-700 border-gray-300 
      transition-all duration-500 ease-in-out ${sidebarWidth}`}
    >
      {/* Icons */}
      <div className="flex flex-col gap-2 items-start justify-start">
        {navlinks.map((link) => (
          <Icon
            key={link.name}
            {...link}
            isActive={isActive}
            label={link.name}
            styles={`w-full ${isExpanded ? 'expanded' : ''}`}
            handleClick={() => {
              if (!link.disabled) {
                //setIsActive(link.name);
                navigate(link.link);
              }
            }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-4 mt-auto">
        {/* Divider:above the toggle button */}
        <div className="my-3 flex justify-center">
          <div
            className={`transition-all duration-300 bg-gray-300 dark:bg-gray-700 rounded 
            ${isExpanded ? 'w-full h-0.5' : 'w-6 h-0.5'}`}
          />
        </div>

      {/* Bottom: Theme toggle + Collapse/Expand */}
      <div className={`flex flex-col gap-4 ${isExpanded ? 'items-start' : 'items-center'}`}>
        <ThemeToggle isExpanded={isExpanded} />
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 flex justify-center items-center gap-2 transition-all duration-300 ease-in-out"
        >
          {isExpanded ? (
            <>
              <X className="w-4 h-4" />
              <span className="text-sm transition-opacity duration-300 ease-in-out opacity-100">Close</span>
            </>
          ) : (
            <>
              <Menu className="w-6 h-6" />
            </>
          )}
        </button>
      </div>
    </div>
  </div>
  );
};

export default Sidebar;
