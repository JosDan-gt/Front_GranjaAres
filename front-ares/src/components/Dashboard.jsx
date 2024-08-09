import React, { useState } from 'react';

const Dashboard = () => {
  // Datos simulados para diferentes lotes
  const lotesData = {
    1: {
      nombre: 'Lote 1',
      produccion: 1230,
      clasificacion: 'A',
      cantidadGallinas: 8000,
      raza: 'Leghorn',
    },
    2: {
      nombre: 'Lote 2',
      produccion: 980,
      clasificacion: 'B',
      cantidadGallinas: 7500,
      raza: 'Rhode Island Red',
    },
    // Puedes agregar más lotes aquí
  };

  // Estado para manejar el lote seleccionado
  const [loteActual, setLoteActual] = useState(1);

  // Función para cambiar de lote
  const cambiarLote = (loteId) => {
    setLoteActual(loteId);
  };

  // Obtener los datos del lote actual
  const datosLote = lotesData[loteActual];

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold">{datosLote.nombre}</h2>
        <div className="flex space-x-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => cambiarLote(1)}
          >
            Lote 1
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => cambiarLote(2)}
          >
            Lote 2
          </button>
          {/* Agrega más botones para más lotes */}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Producción</h3>
          <p className="text-2xl font-bold">{datosLote.produccion}</p>
          <p className="text-sm text-gray-500">Huevos producidos</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Clasificación</h3>
          <p className="text-2xl font-bold">{datosLote.clasificacion}</p>
          <p className="text-sm text-gray-500">Calidad de huevos</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Cantidad de Gallinas</h3>
          <p className="text-2xl font-bold">{datosLote.cantidadGallinas}</p>
          <p className="text-sm text-gray-500">Gallinas en producción</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Raza</h3>
          <p className="text-2xl font-bold">{datosLote.raza}</p>
          <p className="text-sm text-gray-500">Tipo de gallina</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
