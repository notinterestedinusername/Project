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
      {/* Footer */}
      <footer className="w-full bg-black text-white py-6 px-4 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} CrypDan. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-4">
          <a href="/about" className="hover:underline">About Us</a>
          <a href="/contact" className="hover:underline">Contact</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
