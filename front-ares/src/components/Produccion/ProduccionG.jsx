import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ProduccionForm from './ProduccionForm';

const ProduccionG = () => {
  const { idLote } = useParams();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc');
  const [showForm, setShowForm] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);

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

  const handleUpdate = (id) => {
    const itemToUpdate = historial.find(item => item.idProd === id);
    setCurrentItem(itemToUpdate);
    setCurrentId(id);
    setShowForm(true);
  };

  const handleDelete = async (idProd) => {
    try {
      const response = await axios.put(`https://localhost:7249/api/produccionH/updateestado/${idProd}`, {
        Estado: false // O el valor que necesites para el campo `Estado`
      });
      if (response.data.success) {
        alert('Estado actualizado exitosamente.');
        setHistorial(historial.filter(item => item.idProd !== idProd));
      } else {
        alert(`Error al actualizar el estado: ${response.data.message}`);
      }
    } catch (error) {
      alert(`Error al actualizar el estado: ${error.message}`);
    }
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

  const renderActions = (id) => {
    return (
      <td className="py-2 px-4 border-b border-gray-300">
        <button
          onClick={() => handleUpdate(id)}
          className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
        >
          Actualizar
        </button>
        <button
          onClick={() => handleDelete(id)}
          className="px-2 py-1 bg-red-500 text-white rounded"
        >
          Eliminar
        </button>
      </td>
    );
  };

  // Cálculo de los elementos de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = historial.slice(indexOfFirstItem, indexOfLastItem);

  // Cambio de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 bg-orange-300 shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Historial de Producción</h2>
      <div>
        <h3>Agregar Producción</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-500 text-white rounded mb-4"
        >
          {showForm ? '-' : '+'}
        </button>
      </div>
      {showForm && (
        <ProduccionForm
          item={currentItem}
          idLote={idLote}
          onClose={() => {
            setShowForm(false);
            setCurrentId(null);
            setCurrentItem(null); // Limpia el ítem actual
            refreshData(); // Actualiza los datos al cerrar el formulario
          }}
          refreshData={refreshData} // Agrega esta línea
        />
      )}
      <table className="min-w-full bg-white border border-gray-200 rounded text-center">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-300" onClick={handleSortChange}>
              Fecha {sortOrder === 'asc' ? '▲' : '▼'}
            </th>
            <th className="py-2 px-4 border-b border-gray-300">Cajas</th>
            <th className="py-2 px-4 border-b border-gray-300">Cartones</th>
            <th className="py-2 px-4 border-b border-gray-300">Sueltos</th>
            <th className="py-2 px-4 border-b border-gray-300">Defectuosos</th>
            <th className="py-2 px-4 border-b border-gray-300">Total</th>
            <th className="py-2 px-4 border-b border-gray-300">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" className="py-2 px-4 text-center">Cargando...</td>
            </tr>
          ) : currentItems.length ? (
            currentItems.map((item) => (
              <React.Fragment key={item.idProd}>
                <tr>
                  <td className="py-2 px-4 border-b border-gray-300">{formatDate(item.fechaRegistroP)}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{item.cantCajas}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{item.cantCartones}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{item.cantSueltos}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{item.defectuosos}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{item.cantTotal}</td>
                  {renderActions(item.idProd)}
                </tr>
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="py-2 px-4 text-center">No hay registros.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-2 hover:bg-blue-600 disabled:bg-blue-300"
        >
          Anterior
        </button>
        <span className="text-gray-700">
          Página {currentPage} de {Math.ceil(historial.length / itemsPerPage)}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage * itemsPerPage >= historial.length}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ProduccionG;
