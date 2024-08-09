import React from 'react';

const Sidebar = () => {
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <nav>
        <ul>
          <li className="mb-2">
            <a href="#" className="text-white">Inicio</a>
          </li>
          <li className="mb-2">
            <a href="#" className="text-white">Producción</a>
          </li>
          <li className="mb-2">
            <a href="#" className="text-white">Clasificacion De Produccion</a>
          </li>
          <li className="mb-2">
            <a href="#" className="text-white">Reportes</a>
          </li>
          <li className="mb-2">
            <a href="#" className="text-white">Lotes</a>
          </li>
          
          <li className="mb-2">
            <a href="#" className="text-white">Reportes</a>
          </li>
          <li className="mb-2">
            <a href="#" className="text-white">Configuración</a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
