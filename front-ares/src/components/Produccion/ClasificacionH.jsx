import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import ClasificacionForm from './ClasificacionForm';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

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
      const response = await axiosInstance.get(`/clasific1?IdLote=${id}`);
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
    <div className="p-4 sm:p-6 bg-yellow-50 shadow-lg rounded-lg max-w-full w-full ">
      <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-4 md:mb-6 text-center md:text-left">
        Clasificación de Huevos
      </h2>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6">
        <button
          disabled={isDisabled}
          onClick={handleAddClick}
          className={`w-full md:w-auto px-4 md:px-6 py-2 md:py-3 font-semibold rounded-lg transition-colors duration-300 ${isDisabled ? 'bg-gray-400 cursor-not-allowed text-gray-500' : 'bg-green-700 text-white hover:bg-green-800'
            } mb-4 md:mb-0`}
        >
          {showForm ? 'Ocultar Formulario' : 'Agregar Nueva Clasificación'}
        </button>
      </div>

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

      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-4 md:mb-6">
        <input
          type="text"
          placeholder="Buscar por tamaño..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-auto"
        />

        <select
          value={selectedDateType}
          onChange={handleDateTypeChange}
          className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-auto"
        >
          <option value="fechaClaS">Fecha de Clasificación</option>
          <option value="fechaRegistroP">Fecha de Producción</option>
        </select>

        <div className="w-full md:w-auto">
          <DatePicker
            selectsRange
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={handleDateRangeChange}
            className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-auto"
            isClearable={true}
            placeholderText="Seleccionar rango de fechas"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-gray-700">Cargando datos...</p>
      ) : filteredData.length > 0 ? (
        <div className="w-full overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="py-3 px-4 md:px-6 text-left text-xs md:text-sm font-semibold">
                  Tamaño
                </th>
                <th className="py-3 px-4 md:px-6 text-left text-xs md:text-sm font-semibold">
                  Cajas
                </th>
                <th className="py-3 px-4 md:px-6 text-left text-xs md:text-sm font-semibold">
                  Cartones Extra
                </th>
                <th className="py-3 px-4 md:px-6 text-left text-xs md:text-sm font-semibold">
                  Huevos Sueltos
                </th>
                <th className="py-3 px-4 md:px-6 text-left text-xs md:text-sm font-semibold">
                  Cantidad Total
                </th>
                <th className="py-3 px-4 md:px-6 text-left text-xs md:text-sm font-semibold">
                  <div className="flex items-center">
                    Fecha de Clasificación
                    <button
                      onClick={handleSortChange}
                      className="ml-2 text-gray-200 flex items-center"
                    >
                      {sortOrder === 'asc' ? '▲' : '▼'}
                    </button>
                  </div>
                </th>
                <th className="py-3 px-4 md:px-6 text-left text-xs md:text-sm font-semibold">
                  Fecha de Producción
                </th>
                <th className="py-3 px-4 md:px-6 text-left text-xs md:text-sm font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-xs md:text-sm">
              {currentItems.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-200 hover:bg-yellow-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                >
                  <td className="py-3 px-4 md:px-6 whitespace-nowrap">{item.tamano}</td>
                  <td className="py-3 px-4 md:px-6 whitespace-nowrap">{item.cajas}</td>
                  <td className="py-3 px-4 md:px-6 whitespace-nowrap">{item.cartonesExtras}</td>
                  <td className="py-3 px-4 md:px-6 whitespace-nowrap">{item.huevosSueltos}</td>
                  <td className="py-3 px-4 md:px-6 whitespace-nowrap">{item.totalUnitaria}</td>
                  <td className="py-3 px-4 md:px-6 whitespace-nowrap">
                    {item.fechaClaS ? new Date(item.fechaClaS).toLocaleDateString() : 'Sin fecha'}
                  </td>
                  <td className="py-3 px-4 md:px-6 whitespace-nowrap">
                    {item.fechaRegistroP ? new Date(item.fechaRegistroP).toLocaleDateString() : 'Sin fecha'}
                  </td>
                  <td className="py-3 px-4 md:px-6 whitespace-nowrap">
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
      ) : (
        <p className="text-gray-600 text-lg">No hay datos disponibles.</p>
      )}
    </div>
  );

};

export default ClasificacionH;
