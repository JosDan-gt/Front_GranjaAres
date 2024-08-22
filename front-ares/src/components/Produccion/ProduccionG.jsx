import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ProduccionForm from './ProduccionForm';
import { useLocation } from 'react-router-dom';

const ProduccionG = () => {
  const { idLote } = useParams();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc');
  const [showForm, setShowForm] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const location = useLocation();
  const { estadoBaja } = location.state || {};

  const isDisabled = estadoBaja !== undefined ? estadoBaja : false;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://localhost:7249/getproduccion?IdLote=${idLote}`);
        const data = Array.isArray(response.data) ? response.data : [response.data];
        setHistorial(sortData(data));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idLote, sortOrder]);

  const sortData = (data) => {
    return data.sort((a, b) => {
      const dateA = new Date(a.fechaRegistroP);
      const dateB = new Date(b.fechaRegistroP);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };

  const handleSortChange = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://localhost:7249/getproduccion?IdLote=${idLote}`);
      const data = Array.isArray(response.data) ? response.data : [response.data];
      setHistorial(sortData(data));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setCurrentItem(item);
    setShowForm(true);
  };

  const handleAddClick = () => {
    if (!isDisabled) {
      setCurrentItem(null);
      setShowForm(true);
    }
  };

  // Cálculo de los elementos de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = historial.slice(indexOfFirstItem, indexOfLastItem);

  // Cambio de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-full w-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Historial de Producción</h2>

      <button
        disabled={isDisabled}
        onClick={handleAddClick}
        className={`mb-3 px-6 py-3 text-white font-semibold rounded-lg transition-colors duration-300 ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        Agregar Producción
      </button>

      {showForm && (
        <ProduccionForm
          item={currentItem}
          idLote={idLote}
          onClose={() => {
            setShowForm(false);
            setCurrentItem(null); // Limpia el ítem actual
            refreshData(); // Actualiza los datos al cerrar el formulario
          }}
          refreshData={refreshData}
        />
      )}

      <div className="w-full overflow-x-auto">
        <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden text-center">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="py-3 px-6 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200"
                onClick={handleSortChange}
              >
                Fecha {sortOrder === 'asc' ? '▲' : '▼'}
              </th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Cajas</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Cartones</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Sueltos</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Defectuosos</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Total</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-3 px-6 text-center">Cargando...</td>
              </tr>
            ) : currentItems.length ? (
              currentItems.map((item) => (
                <tr key={item.idProd} className="border-b border-gray-200">
                  <td className="py-3 px-6 whitespace-nowrap">{formatDate(item.fechaRegistroP)}</td>
                  <td className="py-3 px-6 whitespace-nowrap">{item.cantCajas}</td>
                  <td className="py-3 px-6 whitespace-nowrap">{item.cantCartones}</td>
                  <td className="py-3 px-6 whitespace-nowrap">{item.cantSueltos}</td>
                  <td className="py-3 px-6 whitespace-nowrap">{item.defectuosos}</td>
                  <td className="py-3 px-6 whitespace-nowrap">{item.cantTotal}</td>
                  <td className="py-3 px-6 whitespace-nowrap">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-300"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-3 px-6 text-center">No hay registros de producción disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-300"
        >
          Anterior
        </button>

        <span className="text-lg text-gray-700">
          Página {currentPage} de {Math.ceil(historial.length / itemsPerPage)}
        </span>

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage * itemsPerPage >= historial.length}
          className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-300"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ProduccionG;
