import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { AuthContext } from '../Context/AuthContext'; // Asegúrate de que AuthContext esté correctamente definido

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false); // Para el desplegable de "Clientes, Productos y Ventas"
  const [openRazasCorral, setOpenRazasCorral] = useState(false); // Para el desplegable de "Razas de Gallinas y Corral"

  // Obtenemos los roles desde AuthContext
  const { roles, isAuthenticated } = useContext(AuthContext); 

  // Validaciones de roles
  const isAdmin = roles?.includes('Admin'); // Verificamos si existe el rol 'Admin'

  // Efecto para reiniciar el estado del sidebar cuando cambian los roles o el estado de autenticación
  useEffect(() => {
    // Reiniciar los estados de los menús desplegables y el sidebar al cambiar roles
    setOpenAdmin(false);
    setOpenRazasCorral(false);
    setIsOpen(false); // Cerrar el menú principal cuando cambian los roles
  }, [roles, isAuthenticated]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Botón del menú hamburguesa para pantallas pequeñas */}
      <button
        onClick={toggleMenu}
        className={`text-white p-3 focus:outline-none sm:hidden fixed left-4 z-40 bg-[#8b4513cc] rounded-full transition-transform duration-200 ${isOpen ? 'top-24' : 'top-16'}`}
      >
        {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
      </button>

      {/* Overlay oscuro cuando el menú está abierto */}
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-20 sm:hidden" onClick={toggleMenu}></div>}

      {/* Sidebar */}
      <nav className={`bg-[#e9e098] text-[#d7ccc8] p-6 h-screen fixed top-19 left-0 z-30 w-64 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 sm:static sm:transform-none overflow-y-auto shadow-lg sm:sticky sm:top-0`}>
        <ul className="space-y-6 mt-20 sm:mt-4">
          <li>
            <Link to="/" className="block p-3 bg-[#5d4037] hover:bg-[#8d6e63] rounded transition-colors duration-200">Dashboard</Link>
          </li>
          <li>
            <Link to="/lotes" className="block p-3 bg-[#5d4037] hover:bg-[#8d6e63] rounded transition-colors duration-200">Lotes</Link>
          </li>

          {/* Desplegable Gestión de Corrales */}
          {isAdmin && (
            <li>
              <button
                onClick={() => setOpenRazasCorral(!openRazasCorral)}
                className="block p-3 w-full text-left bg-[#5d4037] hover:bg-[#8d6e63] rounded transition-colors duration-200 flex justify-between items-center"
              >
                Gestión de Corrales y Razas
                {openRazasCorral ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {openRazasCorral && (
                <ul className="ml-4 mt-2 space-y-2">
                  <li>
                    <Link to="/corrales" className="block p-2 bg-[#5d4037] hover:bg-[#8d6e63] rounded transition-colors duration-200">Corrales</Link>
                  </li>
                  <li>
                    <Link to="/razasg" className="block p-2 bg-[#5d4037] hover:bg-[#8d6e63] rounded transition-colors duration-200">Raza de Gallina</Link>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* Desplegable Gestión de Negocio */}
          {isAdmin && (
            <li>
              <button
                onClick={() => setOpenAdmin(!openAdmin)}
                className="block p-3 w-full text-left bg-[#5d4037] hover:bg-[#8d6e63] rounded transition-colors duration-200 flex justify-between items-center"
              >
                Gestión de Negocio
                {openAdmin ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {openAdmin && (
                <ul className="ml-4 mt-2 space-y-2">
                  <li>
                    <Link to="/cliente" className="block p-2 bg-[#5d4037] hover:bg-[#8d6e63] rounded transition-colors duration-200">Clientes</Link>
                  </li>
                  <li>
                    <Link to="/producto" className="block p-2 bg-[#5d4037] hover:bg-[#8d6e63] rounded transition-colors duration-200">Productos</Link>
                  </li>
                  <li>
                    <Link to="/venta" className="block p-2 bg-[#5d4037] hover:bg-[#8d6e63] rounded transition-colors duration-200">Ventas</Link>
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

export default Sidebar;
