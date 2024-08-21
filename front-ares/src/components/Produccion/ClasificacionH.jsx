import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import ClasificacionForm from './ClasificacionForm';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ClasificacionH = () => {
  const { id } = useParams();
  const [clasificacion, setClasificacion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Estados para el rango de fechas y la búsqueda por fecha específica
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedDateType, setSelectedDateType] = useState('fechaClaS'); // 'fechaClaS' o 'fechaRegistroP'

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
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Clasificación de Huevos</h2>

      {/* Formulario de búsqueda en diseño horizontal */}


      <button
        onClick={() => setShowForm(!showForm)}
        className="px-4 py-2 bg-green-500 text-white rounded mb-4"
      >
        {showForm ? '-' : '+'}
      </button>

      {showForm && (
        <ClasificacionForm
          item={selectedItem}
          idLote={id}
          onClose={handleCloseForm}
          refreshData={refreshData}
          isUpdateMode={selectedItem !== null} // true si hay un item seleccionado, false si no
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

        {/* Selector para tipo de fecha */}
        <select
          value={selectedDateType}
          onChange={handleDateTypeChange}
          className="px-4 py-2 border rounded"
        >
          <option value="fechaClaS">Fecha de Clasificación</option>
          <option value="fechaRegistroP">Fecha de Producción</option>
        </select>

        {/* Calendario de rango de fechas */}
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
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Tamaño</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Cajas</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Cartones Extra</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Huevos Sueltos</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Cantidad Total</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">
                  <div className="flex items-center">
                    Fecha de Clasificación
                    <button
                      onClick={handleSortChange}
                      className="ml-2 text-gray-600 flex items-center"
                    >
                      {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                    </button>
                  </div>
                </th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Fecha de Producción</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {currentItems.map((item, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <td className="py-2 px-4 border-b border-gray-300">{item.tamano}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{item.cajas}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{item.cartonesExtras}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{item.huevosSueltos}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{item.totalUnitaria}</td>
                  <td className="py-2 px-4 border-b border-gray-300">
                    {item.fechaClaS
                      ? new Date(item.fechaClaS).toLocaleDateString()
                      : 'Sin fecha'}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300">
                    {item.fechaRegistroP
                      ? new Date(item.fechaRegistroP).toLocaleDateString()
                      : 'Sin fecha'}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
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
              Página {currentPage} de {Math.ceil(filteredData.length / itemsPerPage)}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage * itemsPerPage >= filteredData.length}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              Siguiente
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-700">No hay datos disponibles.</p>
      )}
    </div>
  );
};

export default ClasificacionH;
