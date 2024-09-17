import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { AuthContext } from './Context/AuthContext';
import { FiLogOut } from 'react-icons/fi';
import fondoHeader from './Img/fondoHeader.jpg';
import HorizontalMenu from './Sidebar/Sidebar'; // Importa el menú horizontal

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
    <>
      <header
        className="relative text-white p-4 flex justify-between items-center shadow-lg"
        style={{
          backgroundImage: `url(${fondoHeader})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '150px',
        }}
      >
        <div className="relative flex items-center space-x-4 z-10">
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-yellow-400">
            Granja Los Ares
          </h1>
        </div>

        <button
          onClick={handleLogout}
          className="relative text-white p-2 rounded-lg transition duration-300 hover:bg-red-600 z-10"
        >
          <FiLogOut size={28} />
        </button>
      </header>

      {/* Aquí el menú horizontal se coloca justo debajo del header */}
      <HorizontalMenu />
    </>
  );
};

export default Header;
