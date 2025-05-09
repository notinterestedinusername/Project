// src/components/Layout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  {/*
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  */}

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isExpanded={isSidebarOpen} setIsExpanded={setIsSidebarOpen} />
      <div className="flex flex-col flex-1">
          <Navbar />
        <main className="flex-1 overflow-y-auto pt-20 p-6 bg-light-background dark:bg-dark-background min-h-full text-light-text dark:text-dark-text">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
