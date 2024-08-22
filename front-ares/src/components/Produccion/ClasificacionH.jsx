import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import ClasificacionForm from './ClasificacionForm';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation } from 'react-router-dom';

const ClasificacionH = () => {
  const { id } = useParams();
  const [clasificacion, setClasificacion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const location = useLocation();
  const { estadoBaja } = location.state || {};

  
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedDateType, setSelectedDateType] = useState('fechaClaS');

  const isDisabled = estadoBaja !== undefined ? estadoBaja : false;

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://localhost:7249/clasific1/${id}`);
      const data = Array.isArray(response.data) ? response.data : [response.data];
      setClasificacion(sortData(data));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [id, sortOrder]);

  const sortData = (data) => {
    return data.sort((a, b) => {
      const dateA = new Date(a.fechaClaS);
      const dateB = new Date(b.fechaClaS);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };

  const handleSortChange = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filterData = (data) => {
    return data.filter((item) => {
      const term = searchTerm.toLowerCase();
      const itemFecha = new Date(item[selectedDateType]).getTime();
      const rangeStart = dateRange[0] ? dateRange[0].getTime() : null;
      const rangeEnd = dateRange[1] ? dateRange[1].getTime() : null;


      return (
        item.tamano.toLowerCase().includes(term) &&
        (!rangeStart || !rangeEnd || (itemFecha >= rangeStart && itemFecha <= rangeEnd))
      );
    });
  };

  const filteredData = filterData(clasificacion);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddClick = () => {
    setSelectedItem(null);
    setShowForm(true);
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedItem(null);
  };

  const handleDateRangeChange = (dates) => {
    const [start, end] = dates;
    setDateRange([start, end]);
  };



  const handleDateTypeChange = (e) => {
    setSelectedDateType(e.target.value);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-full w-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Clasificación de Huevos</h2>

      <button
        disabled={isDisabled}
        onClick={handleAddClick}
        className={`px-6 py-3 text-white font-semibold rounded-lg transition-colors duration-300 ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} mb-6`}
      >
        {showForm ? 'Ocultar Formulario' : 'Agregar Nueva Clasificación'}
      </button>

      {showForm && (
        <ClasificacionForm
          key={selectedItem ? selectedItem.id : 'new'}
          item={selectedItem}
          idLote={id}
          onClose={handleCloseForm}
          refreshData={refreshData}
          isUpdateMode={selectedItem !== null}
        />
      )}

      <div className="flex flex-wrap items-center space-x-4 mb-4 mt-5">
        <input
          type="text"
          placeholder="Buscar por tamaño..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded"
        />

        <select
          value={selectedDateType}
          onChange={handleDateTypeChange}
          className="px-4 py-2 border rounded"
        >
          <option value="fechaClaS">Fecha de Clasificación</option>
          <option value="fechaRegistroP">Fecha de Producción</option>
        </select>

        <div className="flex items-center space-x-2">
          <DatePicker
            selectsRange
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={handleDateRangeChange}
            className="px-4 py-2 border rounded"
            isClearable={true}
            placeholderText="Seleccionar rango de fechas"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-gray-700">Cargando datos...</p>
      ) : filteredData.length > 0 ? (
        <>
          <div className="w-full overflow-x-auto">
            <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Tamaño</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Cajas</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Cartones Extra</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Huevos Sueltos</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Cantidad Total</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                    <div className="flex items-center">
                      Fecha de Clasificación
                      <button
                        onClick={handleSortChange}
                        className="ml-2 text-gray-600 flex items-center"
                      >
                        {sortOrder === 'asc' ? '▲' : '▼'}
                      </button>
                    </div>
                  </th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Fecha de Producción</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {currentItems.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    <td className="py-3 px-6 whitespace-nowrap">{item.tamano}</td>
                    <td className="py-3 px-6 whitespace-nowrap">{item.cajas}</td>
                    <td className="py-3 px-6 whitespace-nowrap">{item.cartonesExtras}</td>
                    <td className="py-3 px-6 whitespace-nowrap">{item.huevosSueltos}</td>
                    <td className="py-3 px-6 whitespace-nowrap">{item.totalUnitaria}</td>
                    <td className="py-3 px-6 whitespace-nowrap">{item.fechaClaS ? new Date(item.fechaClaS).toLocaleDateString() : 'Sin fecha'}</td>
                    <td className="py-3 px-6 whitespace-nowrap">{item.fechaRegistroP ? new Date(item.fechaRegistroP).toLocaleDateString() : 'Sin fecha'}</td>
                    <td className="py-3 px-6 whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-300"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
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
              Página {currentPage} de {Math.ceil(filteredData.length / itemsPerPage)}
            </span>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage * itemsPerPage >= filteredData.length}
              className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-300"
            >
              Siguiente
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-600 text-lg">No hay datos disponibles.</p>
      )}
    </div>
  );

};

export default ClasificacionH;
