// src/components/Navbar/Navbar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineQuestionCircle,
  AiOutlineLogout
} from 'react-icons/ai';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Navbar links: Home only
  const links = [
    { to: '/',        label: 'Početna', icon: <AiOutlineHome /> }
  ];

  // Action links: Profile, Help
  const actions = [
    { to: '/profile', label: 'Profil', icon: <AiOutlineUser /> },
    { to: '/help',    label: 'Pomoć',  icon: <AiOutlineQuestionCircle /> }
  ];

  const handleLogout = () => {
    // TODO: integrate your logout flow
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md px-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16">
        {/* Left: Home link */}
        <ul className="flex space-x-4">
          {links.map(l => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={`flex items-center p-2 rounded-md ${
                  location.pathname === l.to
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-blue-100'
                }`}
              >
                <span className="text-xl mr-1">{l.icon}</span>
                <span className="font-medium">{l.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: Profile, Help, Logout */}
        <ul className="flex space-x-4">
          {actions.map(a => (
            <li key={a.to}>
              <Link
                to={a.to}
                className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <span className="text-xl mr-1">{a.icon}</span>
                <span className="font-medium">{a.label}</span>
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <AiOutlineLogout className="text-xl mr-1" />
              <span className="font-medium">Odjava</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
