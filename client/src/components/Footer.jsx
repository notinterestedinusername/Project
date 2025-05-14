// Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-4 mt-auto">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} CrypDan. All Rights Reserved.</p>
        <div className="mt-2">
          <a href="/privacy-policy" className="text-white hover:text-gray-300 mx-2">Privacy Policy</a>
          <a href="/terms" className="text-white hover:text-gray-300 mx-2">Terms of Service</a>
        </div>
      </div>
    </footer>
    
  );
};

export default Footer;
