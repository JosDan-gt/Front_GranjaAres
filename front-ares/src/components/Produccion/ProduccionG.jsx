import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance'; // Importa la instancia de Axios configurada
import { useParams } from 'react-router-dom';
import ProduccionForm from './ProduccionForm';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';



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
        const response = await axiosInstance.get(`/getproduccion?IdLote=${idLote}`);
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
      const response = await axiosInstance.get(`/getproduccion?IdLote=${idLote}`);
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
    <div className="p-4 sm:p-6 bg-yellow-50 shadow-lg rounded-lg">
      <div className="flex justify-start mb-6 text-lg">
        <Link
          to={`/clasificacion/${idLote}`}
          className="text-green-700 hover:text-green-900 transition duration-300"
        >
          Clasificación
        </Link>
        <span className="mx-2 text-green-700">/</span>
        <Link
          to={`/estado/${idLote}`}
          className="text-green-700 hover:text-green-900 transition duration-300"
        >
          Estado Lote
        </Link>
      </div>


      <h2 className="text-2xl sm:text-3xl font-bold text-green-900 mb-4 sm:mb-6 text-center">Historial de Producción</h2>

      <div className="flex justify-end mb-4">
        <button
          disabled={isDisabled}
          onClick={handleAddClick}
          className={`px-4 py-2 mb-4 ${isDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-700 text-white rounded hover:bg-green-800 transition duration-300'}`}
        >
          + Agregar Producción
        </button>
      </div>

      {showForm && (
        <ProduccionForm
          item={currentItem}
          idLote={idLote}
          onClose={() => {
            setShowForm(false);
            setCurrentItem(null);
            refreshData();
          }}
          refreshData={refreshData}
        />
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700 bg-white shadow-md rounded-lg">
          <thead className="text-xs text-white uppercase bg-green-700">
            <tr>
              <th className="px-6 py-3 text-center">Fecha</th>
              <th className="px-6 py-3 text-center">Cajas</th>
              <th className="px-6 py-3 text-center">Cartones</th>
              <th className="px-6 py-3 text-center">Sueltos</th>
              <th className="px-6 py-3 text-center">Defectuosos</th>
              <th className="px-6 py-3 text-center">Total</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">Cargando...</td>
              </tr>
            ) : currentItems.length ? (
              currentItems.map((item) => (
                <tr key={item.idProd} className="bg-white border-b hover:bg-yellow-50">
                  <td className="px-6 py-4 text-center">{formatDate(item.fechaRegistroP)}</td>
                  <td className="px-6 py-4 text-center">{item.cantCajas}</td>
                  <td className="px-6 py-4 text-center">{item.cantCartones}</td>
                  <td className="px-6 py-4 text-center">{item.cantSueltos}</td>
                  <td className="px-6 py-4 text-center">{item.defectuosos}</td>
                  <td className="px-6 py-4 text-center">{item.cantTotal}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition duration-300"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">No hay registros de producción disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 bg-green-700 text-white text-sm rounded-md hover:bg-green-800 transition duration-300 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm text-green-700">
          Página {currentPage} de {Math.ceil(historial.length / itemsPerPage)}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage * itemsPerPage >= historial.length}
          className="px-3 py-2 bg-green-700 text-white text-sm rounded-md hover:bg-green-800 transition duration-300 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );



};

export default ProduccionG;