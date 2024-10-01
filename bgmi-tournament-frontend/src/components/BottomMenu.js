import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaWallet, FaUsers, FaShareAlt } from 'react-icons/fa';
import './BottomMenu.css'; // Import custom CSS for animations

const BottomMenu = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 shadow-lg z-50">
      <div className="flex justify-around items-center py-2">
        <Link to="/refer" className={`menu-item ${location.pathname === '/refer' ? 'active' : ''}`}>
          <FaShareAlt className="text-white text-xl" />
          <span className="text-white text-xs">Refer</span>
        </Link>
        <Link to="/wallet" className={`menu-item ${location.pathname === '/wallet' ? 'active' : ''}`}>
          <FaWallet className="text-white text-xl" />
          <span className="text-white text-xs">Wallet</span>
        </Link>
        <Link to="/" className={`menu-item home ${location.pathname === '/' ? 'active' : ''}`}>
          <FaHome className="text-white text-2xl" />
          <span className="text-white text-xs">Home</span>
        </Link>
        <Link to="/team" className={`menu-item ${location.pathname === '/team' ? 'active' : ''}`}>
          <FaUsers className="text-white text-xl" />
          <span className="text-white text-xs">Team</span>
        </Link>
        <Link to="/profile" className={`menu-item ${location.pathname === '/profile' ? 'active' : ''}`}>
          <FaUser className="text-white text-xl" />
          <span className="text-white text-xs">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomMenu;
