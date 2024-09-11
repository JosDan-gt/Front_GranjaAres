import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import RazaForm from './RazasGForm';

const RazaG = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editRaza, setEditRaza] = useState(null); // Estado para la raza a editar

  // Función para obtener los datos de la API
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('/api/razaG/getrazaG');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Manejar cuando se haga clic en "Actualizar"
  const handleUpdateClick = (raza) => {
    setEditRaza(raza); // Pasar los datos completos de la raza
    setShowForm(true); // Mostrar el formulario
  };

  // Función para cerrar el formulario
  const handleFormClose = () => {
    setShowForm(false);
    setEditRaza(null);
    fetchData(); // Actualizar la lista después de agregar o editar una raza
  };

  return (
    <div className="p-4 sm:p-6 bg-yellow-50 shadow-lg rounded-lg max-w-full w-full">
      {/* Centramos el título */}
      <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-4 md:mb-6 text-center">
        Raza de Gallinas
      </h2>

      {/* Centramos el botón */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditRaza(null); // Resetea los datos si es un nuevo registro
          }}
          className="px-4 py-2 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors duration-300"
        >
          {showForm ? 'Ocultar Formulario' : 'Agregar Nueva Raza'}
        </button>
      </div>

      {showForm && <RazaForm raza={editRaza} onClose={handleFormClose} />}

      {loading ? (
        <p className="text-gray-700">Cargando datos...</p>
      ) : data.length > 0 ? (
        <div className="w-full overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-green-700 text-white">
              <tr>
                {/* Eliminamos las columnas de ID Raza y Estado */}
                <th className="py-3 px-4 md:px-6 text-left text-xs md:text-sm font-semibold">Raza</th>
                <th className="py-3 px-4 md:px-6 text-left text-xs md:text-sm font-semibold">Origen</th>
                <th className="py-3 px-4 md:px-6 text-left text-xs md:text-sm font-semibold">Color</th>
                <th className="py-3 px-4 md:px-6 text-left text-xs md:text-sm font-semibold">Color Huevo</th>
                <th className="py-3 px-4 md:px-6 text-left text-xs md:text-sm font-semibold">Características Específicas</th>
                <th className="py-3 px-4 md:px-6 text-left text-xs md:text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-xs md:text-sm">
              {data.map((raza, index) => (
                <tr
                  key={raza.idRaza}
                  className={`border-b border-gray-200 hover:bg-yellow-50 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="py-3 px-4 md:px-6 whitespace-nowrap">{raza.raza}</td>
                  <td className="py-3 px-4 md:px-6 whitespace-nowrap">{raza.origen}</td>
                  <td className="py-3 px-4 md:px-6 whitespace-nowrap">{raza.color}</td>
                  <td className="py-3 px-4 md:px-6 whitespace-nowrap">{raza.colorH}</td>
                  <td className="py-3 px-4 md:px-6 whitespace-nowrap">{raza.caractEspec}</td>
                  <td className="py-3 px-4 md:px-6 whitespace-nowrap">
                    <button
                      onClick={() => handleUpdateClick(raza)} // Pasar los datos completos de la raza
                      className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-300"
                    >
                      Actualizar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 text-lg">No hay datos disponibles.</p>
      )}
    </div>
  );
};

export default RazaG;
