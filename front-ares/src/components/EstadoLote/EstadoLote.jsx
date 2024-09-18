import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { useParams, Link, useLocation } from 'react-router-dom';
import EstadoLoteForm from './EstadoLoteForm';
import { FaCalendarAlt, FaEdit, FaTrash, FaEgg, FaSortUp, FaSortDown, FaBox } from 'react-icons/fa';
import { MdRealEstateAgent } from "react-icons/md";
import { LuReplace } from "react-icons/lu";
import { GiEggClutch } from "react-icons/gi";
import { TbBuildingEstate } from "react-icons/tb";


const EstadoLote = () => {
  const { idLote } = useParams();
  const [estadoLote, setEstadoLote] = useState([]);
  const [selectedEstado, setSelectedEstado] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortDirection, setSortDirection] = useState('desc');
  const [isLoteBaja, setIsLoteBaja] = useState(false);
  const location = useLocation();
  const { estadoBaja } = location.state || {};
  const [loading, setLoading] = useState(true);

  const isDisabled = estadoBaja !== undefined ? estadoBaja : false;

  useEffect(() => {
    const fetchEstadoLote = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/getestadolote?idLote=${idLote}`);
        const sortedData = response.data.sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro));
        setEstadoLote(sortedData);
      } catch (error) {
        console.error('Error fetching estadoLote:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLoteStatus = async () => {
      try {
        const response = await axiosInstance.get(`/getlote?idLote=${idLote}`);
        setIsLoteBaja(response.data.estadoBaja);
      } catch (error) {
        console.error('Error fetching lote status:', error);
      }
    };

    if (idLote) {
      fetchEstadoLote();
      fetchLoteStatus();
    }
  }, [idLote]);

  const handleAddNew = () => {
    setSelectedEstado(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (estado) => {
    setSelectedEstado(estado);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setIsEditing(false);
    setSelectedEstado(null);
  };

  const handleSortByDate = () => {
    const sortedData = [...estadoLote].sort((a, b) => {
      return sortDirection === 'asc' ? new Date(a.fechaRegistro) - new Date(b.fechaRegistro) : new Date(b.fechaRegistro) - new Date(a.fechaRegistro);
    });
    setEstadoLote(sortedData);
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleDelete = async (idEstado) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este estado?");
    if (confirmDelete) {
      try {
        await axiosInstance.put(`/api/estadolote/updateestado/${idEstado}`, { estado: false });
        alert('Estado eliminado exitosamente');
        handleFormSubmit();
      } catch (error) {
        console.error('Error al eliminar el estado del lote:', error.response?.data || error.message);
        alert('Error al eliminar el estado del lote');
      }
    }
  };

  const totalPages = Math.ceil(estadoLote.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = estadoLote.slice(indexOfFirstItem, indexOfLastItem);

  const handleFormSubmit = () => {
    setShowForm(false);
    setIsEditing(false);
    setSelectedEstado(null);
    const fetchEstadoLote = async () => {
      try {
        const response = await axiosInstance.get(`/getestadolote?idLote=${idLote}`);
        const sortedData = response.data.sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro));
        setEstadoLote(sortedData);
      } catch (error) {
        console.error('Error fetching estadoLote:', error);
      }
    };
    fetchEstadoLote();
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

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 shadow-xl rounded-xl">
      <div className="flex justify-start mb-6 text-lg items-center">
        <Link to={`/produccionG/${idLote}`} state={{ estadoBaja }} className="text-blue-700 hover:text-blue-900 transition duration-300 flex items-center space-x-2">
          <GiEggClutch className="text-blue-700" />
          <span>Producción</span>
        </Link>
        <span className="mx-2 text-blue-700">/</span>
        <Link to={`/clasificacion/${idLote}`} state={{ estadoBaja }} className="text-blue-700 hover:text-blue-900 transition duration-300 flex items-center space-x-2">
          <LuReplace className="text-blue-700" />
          <span>Clasificación</span>
        </Link>
      </div>

      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center tracking-wider">
        <MdRealEstateAgent className="inline-block mb-2 text-blue-700" /> Estado del Lote
      </h2>

      {!isLoteBaja && (
        <div className="flex justify-center mb-6">
          <button
            disabled={isDisabled}
            onClick={handleAddNew}
            className={`px-6 py-3 text-white font-semibold rounded-full shadow-lg transition-all duration-300 ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700'}`}
          >
            <TbBuildingEstate className="inline-block mr-2" size={25} />
            {showForm ? 'Ocultar Formulario' : 'Agregar Nuevo Estado'}
          </button>
        </div>
      )}

      {showForm && (
        <EstadoLoteForm
          key={selectedEstado ? selectedEstado.idEstado : 'new'}
          estadoData={selectedEstado}
          isEditing={isEditing}
          idLote={idLote}
          onSubmit={handleFormSubmit}
          onCancel={handleFormClose}
        />
      )}

      <div className="overflow-x-auto max-w-full rounded-lg shadow-lg">
        <table className="w-full text-sm text-left text-gray-700 bg-white rounded-lg">
          <thead className="text-xs text-white uppercase bg-gradient-to-r from-blue-600 to-blue-800">
            <tr>
              <th className="px-6 py-3 text-center cursor-pointer" onClick={handleSortByDate}>
                <FaCalendarAlt className="inline-block mr-1" /> Fecha de Registro {sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />}
              </th>
              <th className="px-6 py-3 text-center">Cantidad de Gallinas</th>
              <th className="px-6 py-3 text-center">Bajas</th>
              <th className="px-6 py-3 text-center">Semana</th>
              <th className="px-6 py-3 text-center">Etapa</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">Cargando...</td>
              </tr>
            ) : currentItems.length ? (
              currentItems.map((estado) => (
                <tr key={estado.idEstado} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-center">{new Date(estado.fechaRegistro).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-center">{estado.cantidadG}</td>
                  <td className="px-6 py-4 text-center">{estado.bajas}</td>
                  <td className="px-6 py-4 text-center">{estado.semana}</td>
                  <td className="px-6 py-4 text-center">{estado.idEtapa === 1 ? 'Crianza' : 'Desarrollo'}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleEdit(estado)}
                      disabled={isDisabled}
                      className={`px-4 py-2 font-semibold rounded-lg shadow-md transition-colors duration-300 ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 text-white hover:bg-yellow-600'}`}
                    >
                      <FaEdit className="inline-block mr-1" /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(estado.idEstado)}
                      disabled={isDisabled}
                      className={`px-4 py-2 font-semibold rounded-lg shadow-md transition-colors duration-300 ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'}`}
                    >
                      <FaTrash className="inline-block mr-1" /> Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">No hay registros de estado disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination totalPages={totalPages} currentPage={currentPage} paginate={paginate} />
    </div>
  );
};

export default EstadoLote;
