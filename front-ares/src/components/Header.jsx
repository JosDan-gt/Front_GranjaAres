import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './Context/AuthContext.jsx'; // Ajusta la ruta según tu estructura
import Cookies from 'js-cookie';
import { FiLogOut } from 'react-icons/fi'; // Asegúrate de tener instalada la librería react-icons

const Header = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    Cookies.remove('token');
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-[rgba(210,180,140,0.8)] text-white p-4 flex justify-between items-center shadow-lg">
      <div className="flex items-center space-x-4">
        <img
          src="/path/to/your/logo.png" // Puedes usar un logo de gallo, huevo o granja
          alt="Logo de Granja"
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16"
        />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-yellow-900 drop-shadow-lg" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          Granja Los Ares
        </h1>

      </div>
      <button
        onClick={handleLogout}
        className="text-white p-2 rounded-lg transition duration-300"
      >
        <FiLogOut size={28} />
      </button>
    </header>
  );
};

export default Header;
