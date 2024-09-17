import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { AuthContext } from '../Context/AuthContext';

const HorizontalMenu = () => {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar el menú hamburguesa
  const [openAdmin, setOpenAdmin] = useState(false); 
  const [openRazasCorral, setOpenRazasCorral] = useState(false);

  const { roles } = useContext(AuthContext);
  const isAdmin = roles?.includes('Admin');

  useEffect(() => {
    setOpenAdmin(false);
    setOpenRazasCorral(false);
  }, [roles]);

  // Alterna el menú hamburguesa
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-[#2d3748] text-white">
      {/* Botón del menú hamburguesa para pantallas pequeñas */}
      <div className="flex justify-between items-center p-4 sm:hidden">
        <span className="text-xl font-bold">Menú</span>
        <button onClick={toggleMenu} className="focus:outline-none">
          {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      {/* Menú principal (desplegado o colapsado según el estado) */}
      <nav className={`sm:flex ${isOpen ? 'block' : 'hidden'} sm:block`}>
        <ul className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 p-4 sm:items-center">
          <li>
            <Link to="/dashboard" className="text-white hover:text-yellow-400 transition">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/lotes" className="text-white hover:text-yellow-400 transition">
              Lotes
            </Link>
          </li>

          {/* Desplegable Gestión de Corrales y Razas */}
          {isAdmin && (
            <li className="relative">
              <button
                onClick={() => setOpenRazasCorral(!openRazasCorral)}
                className="text-white hover:text-yellow-400 transition flex items-center"
              >
                Gestión de Corrales y Razas {openRazasCorral ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {openRazasCorral && (
                <ul className="absolute mt-2 bg-[#4a5568] rounded shadow-lg space-y-2 p-2">
                  <li>
                    <Link to="/corrales" className="block text-white hover:text-yellow-400 transition">
                      Corrales
                    </Link>
                  </li>
                  <li>
                    <Link to="/razasg" className="block text-white hover:text-yellow-400 transition">
                      Raza de Gallina
                    </Link>
                  </li>
                  <li>
                    <Link to="/gestion" className="block text-white hover:text-yellow-400 transition">
                      Gestión de Lotes
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* Desplegable Gestión de Negocio */}
          {isAdmin && (
            <li className="relative">
              <button
                onClick={() => setOpenAdmin(!openAdmin)}
                className="text-white hover:text-yellow-400 transition flex items-center"
              >
                Gestión de Negocio {openAdmin ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {openAdmin && (
                <ul className="absolute mt-2 bg-[#4a5568] rounded shadow-lg space-y-2 p-2">
                  <li>
                    <Link to="/cliente" className="block text-white hover:text-yellow-400 transition">
                      Clientes
                    </Link>
                  </li>
                  <li>
                    <Link to="/producto" className="block text-white hover:text-yellow-400 transition">
                      Productos
                    </Link>
                  </li>
                  <li>
                    <Link to="/venta" className="block text-white hover:text-yellow-400 transition">
                      Ventas
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default HorizontalMenu;
