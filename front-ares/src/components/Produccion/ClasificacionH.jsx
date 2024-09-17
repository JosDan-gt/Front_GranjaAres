import React, { useState, useEffect } from 'react';
import { FaBox, FaEgg, FaLayerGroup, FaSortUp, FaSortDown, FaEdit } from 'react-icons/fa';
import axiosInstance from '../axiosInstance';
import { useParams, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ClasificacionForm from './ClasificacionForm';
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
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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

  const Pagination = ({ totalPages, currentPage, paginate }) => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center mt-4 space-x-2">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-4 py-2 font-semibold rounded-lg shadow-md transition-all duration-300 focus:outline-none ${
              currentPage === number
                ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white'
                : 'bg-white text-blue-700 border border-gray-300 hover:bg-blue-100 hover:text-blue-900'
            }`}
          >
            {number}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 shadow-xl rounded-xl">
      <div className="flex justify-start mb-6 text-lg items-center">
        <Link
          to={`/produccionG/${id}`}
          state={{ estadoBaja }}
          className="text-blue-700 hover:text-blue-900 transition duration-300 flex items-center space-x-2"
        >
          <FaBox className="text-blue-700" /> {/* Ícono de caja */}
          <span>Producción</span>
        </Link>
        <span className="mx-2 text-blue-700">/</span>
        <Link
          to={`/estado/${id}`}
          state={{ estadoBaja }}
          className="text-blue-700 hover:text-blue-900 transition duration-300 flex items-center space-x-2"
        >
          <FaBox className="text-blue-700" /> {/* Ícono de caja */}
          <span>Estado Lote</span>
        </Link>
      </div>

      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center tracking-wider">
        <FaBox className="inline-block mb-2 text-blue-700" /> {/* Icono en el título */}
        Clasificación de Huevos
      </h2>

      <div className="flex justify-center mb-4">
        <button
          disabled={isDisabled}
          onClick={handleAddClick}
          className={`px-6 py-3 text-white font-semibold rounded-full shadow-lg transition-all duration-300 ${
            isDisabled
              ? 'bg-gray-400 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700'
          }`}
        >
          <FaBox className="inline-block mr-2" /> {/* Ícono en el botón */}
          Agregar Clasificación
        </button>
      </div>

      {showForm && (
        <ClasificacionForm
          item={selectedItem}
          idLote={id}
          onClose={handleCloseForm}
          refreshData={refreshData}
          isUpdateMode={selectedItem !== null}
        />
      )}

      <div className="overflow-x-auto max-w-full rounded-lg shadow-lg">
        <table className="w-full text-sm text-left text-gray-700 bg-white rounded-lg">
          <thead className="text-xs text-white uppercase bg-gradient-to-r from-blue-600 to-blue-800">
            <tr>
              <th className="px-6 py-3 text-center">Tamaño</th>
              <th className="px-6 py-3 text-center">
                <FaBox className="inline-block mr-1" /> Cajas
              </th>
              <th className="px-6 py-3 text-center">
                <FaLayerGroup className="inline-block mr-1" /> Cartones Extra
              </th>
              <th className="px-6 py-3 text-center">
                <FaEgg className="inline-block mr-1" /> Huevos Sueltos
              </th>
              <th className="px-6 py-3 text-center">Cantidad Total</th>
              <th className="px-6 py-3 text-center">
                <div className="flex items-center justify-center">
                  Fecha de Clasificación
                  <button
                    onClick={handleSortChange}
                    className="ml-2 text-gray-200 flex items-center"
                  >
                    {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                  </button>
                </div>
              </th>
              <th className="px-6 py-3 text-center">Fecha de Producción</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="py-4 text-center text-gray-500">
                  Cargando datos...
                </td>
              </tr>
            ) : currentItems.length ? (
              currentItems.map((item, index) => (
                <tr
                  key={index}
                  className={`bg-white border-b hover:bg-gray-50 ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <td className="px-6 py-4 text-center">{item.tamano}</td>
                  <td className="px-6 py-4 text-center">{item.cajas}</td>
                  <td className="px-6 py-4 text-center">{item.cartonesExtras}</td>
                  <td className="px-6 py-4 text-center">{item.huevosSueltos}</td>
                  <td className="px-6 py-4 text-center">{item.totalUnitaria}</td>
                  <td className="px-6 py-4 text-center">
                    {item.fechaClaS
                      ? new Date(item.fechaClaS).toLocaleDateString()
                      : 'Sin fecha'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.fechaRegistroP
                      ? new Date(item.fechaRegistroP).toLocaleDateString()
                      : 'Sin fecha'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg shadow-md hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300"
                    >
                      <FaEdit className="inline-block mr-2" /> {/* Ícono de editar */}
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-4 text-center text-gray-500">
                  No hay registros disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination totalPages={totalPages} currentPage={currentPage} paginate={paginate} />
      </div>
    </div>
  );
};

export default ClasificacionH;
