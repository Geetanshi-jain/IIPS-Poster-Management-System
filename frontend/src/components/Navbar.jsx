import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-800 p-4 text-white flex justify-between items-center shadow-lg">
      <div className="font-bold text-xl cursor-pointer" onClick={() => navigate('/')}>IIPS Poster System</div>
      <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-semibold transition-colors">
        Logout
      </button>
    </nav>
  );
}
