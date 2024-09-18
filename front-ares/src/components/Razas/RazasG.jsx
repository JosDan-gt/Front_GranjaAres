import React, { useState, useEffect } from 'react';
import { FaEdit, FaPlus } from 'react-icons/fa'; // Iconos para el diseño
import axiosInstance from '../axiosInstance';
import RazaForm from './RazasGForm';

const RazaG = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editRaza, setEditRaza] = useState(null); // Estado para la raza a editar

  // Función para obtener los datos de la API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/razaG/getrazaG');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
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
    <div className="p-6 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 shadow-xl rounded-xl">
      {/* Título centrado */}
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center tracking-wider">
        <FaPlus className="inline-block mb-2 text-green-700" /> {/* Ícono en el título */}
        Raza de Gallinas
      </h2>

      {/* Botón centrado */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditRaza(null); // Resetea los datos si es un nuevo registro
          }}
          className={`px-6 py-3 text-white font-semibold rounded-full shadow-lg transition-all duration-300 ${
            showForm
              ? 'bg-gradient-to-r from-red-500 to-red-700 hover:from-red-400 hover:to-red-600'
              : 'bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700'
          }`}
        >
          <FaPlus className="inline-block mr-2" /> {/* Ícono de agregar */}
          {showForm ? 'Ocultar Formulario' : 'Agregar Nueva Raza'}
        </button>
      </div>

      {showForm && <RazaForm raza={editRaza} onClose={handleFormClose} />}

      {loading ? (
        <p className="text-gray-700 text-center">Cargando datos...</p>
      ) : data.length > 0 ? (
        <div className="overflow-x-auto max-w-full rounded-lg shadow-lg">
          <table className="min-w-full text-sm text-left text-gray-700 bg-white rounded-lg">
            <thead className="text-xs text-white uppercase bg-gradient-to-r from-green-600 to-green-800">
              <tr>
                <th className="px-6 py-3 text-center">Raza</th>
                <th className="px-6 py-3 text-center">Origen</th>
                <th className="px-6 py-3 text-center">Color</th>
                <th className="px-6 py-3 text-center">Color Huevo</th>
                <th className="px-6 py-3 text-center">Características Específicas</th>
                <th className="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((raza, index) => (
                <tr
                  key={raza.idRaza}
                  className={`bg-white border-b hover:bg-gray-50 ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <td className="px-6 py-4 text-center">{raza.raza}</td>
                  <td className="px-6 py-4 text-center">{raza.origen}</td>
                  <td className="px-6 py-4 text-center">{raza.color}</td>
                  <td className="px-6 py-4 text-center">{raza.colorH}</td>
                  <td className="px-6 py-4 text-center">{raza.caractEspec}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleUpdateClick(raza)}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg shadow-md hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 flex items-center"
                    >
                      <FaEdit className="inline-block mr-2" /> {/* Ícono de editar */}
                      Actualizar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 text-center">No hay datos disponibles.</p>
      )}
    </div>
  );
};

export default RazaG;
