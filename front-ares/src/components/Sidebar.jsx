// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <nav className="w-64 bg-gray-800 text-white">
      <ul className="p-4">
        <li>
          <Link to="/" className="block p-2 hover:bg-gray-700">Dashboard</Link>
        </li>
        <li>
          <Link to="/lotes" className="block p-2 hover:bg-gray-700">Lotes</Link>
        </li>
        {/* Comenta o elimina esta línea para quitar la opción de Producción
        <li>
          <Link to="/produccion" className="block p-2 hover:bg-gray-700">Producción</Link>
        </li>
        */}
        {/* Agrega otras opciones del menú aquí */}
      </ul>
    </nav>
  );
};

export default Sidebar;
