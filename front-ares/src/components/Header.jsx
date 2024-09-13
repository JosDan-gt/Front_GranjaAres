import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { AuthContext } from '../components/Context/AuthContext'; // Ajusta la ruta según tu estructura
import { FiLogOut } from 'react-icons/fi';
import fondoHeader from './Img/fondoHeader.jpg'; // Importa la imagen

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
    <header
      className="relative text-white p-4 flex justify-between items-center shadow-lg"
      style={{
        backgroundImage: `url(${fondoHeader})`, // Usar la imagen importada
        backgroundSize: 'cover', // Asegurar que la imagen cubra todo el fondo
        backgroundPosition: 'top', // Ajustar la posición de la imagen hacia arriba
        backgroundRepeat: 'no-repeat', // Asegurar que la imagen no se repita
        height: '150px', // Ajustar la altura del header
      }}
    >
      <div className="relative flex items-center space-x-4 z-10">
        <img
          src="./Img/logo.png" // Puedes usar un logo de gallo, huevo o granja
          alt="Logo de Granja"
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16"
        />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-yellow-900 drop-shadow-lg" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          Granja Los Ares
        </h1>
      </div>

      <button
        onClick={handleLogout}
        className="relative text-white p-2 rounded-lg transition duration-300 z-10"
      >
        <FiLogOut size={28} />
      </button>
    </header>
  );
};

export default Header;
