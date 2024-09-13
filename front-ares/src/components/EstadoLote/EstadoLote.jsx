import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance'; // Importa la instancia de axios configurada
import { useParams, Link } from 'react-router-dom';
import EstadoLoteForm from './EstadoLoteForm'; // Importa el formulario
import { useLocation } from 'react-router-dom';

const EstadoLote = () => {
    const { idLote } = useParams();
    const [estadoLote, setEstadoLote] = useState([]);
    const [selectedEstado, setSelectedEstado] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Número de elementos por página
    const [sortDirection, setSortDirection] = useState('desc'); // Dirección de la ordenación
    const [isLoteBaja, setIsLoteBaja] = useState(false); // Estado del lote
    const location = useLocation();
    const { estadoBaja } = location.state || {};

    const isDisabled = estadoBaja !== undefined ? estadoBaja : false;

    useEffect(() => {
        const fetchEstadoLote = async () => {
            try {
                const response = await axiosInstance.get(`/getestadolote?idLote=${idLote}`);
                const sortedData = response.data.sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro));
                setEstadoLote(sortedData);
            } catch (error) {
                console.error('Error fetching estadoLote:', error);
            }
        };

        const fetchLoteStatus = async () => {
            try {
                const response = await axiosInstance.get(`/getlote?idLote=${idLote}`); // Cambia a tu endpoint adecuado
                setIsLoteBaja(response.data.estadoBaja); // Almacena el estado de baja del lote
            } catch (error) {
                console.error('Error fetching lote status:', error);
            }
        };

        if (idLote) {
            fetchEstadoLote();
            fetchLoteStatus(); // Verifica el estado del lote
        }
    }, [idLote]);

    const handleAddNew = () => {
        if (showForm) {
            handleFormClose();
        } else {
            setSelectedEstado(null);
            setIsEditing(false);
            setShowForm(true);
        }
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
                await axiosInstance.put(`/api/estadolote/updateestado/${idEstado}`, {
                    estado: false,
                });
                alert('Estado eliminado exitosamente');
                handleFormSubmit();
            } catch (error) {
                console.error('Error al eliminar el estado del lote:', error.response?.data || error.message);
                alert('Error al eliminar el estado del lote');
            }
        }
    };

    // Cálculo para la paginación
    const totalPages = Math.ceil(estadoLote.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = estadoLote.slice(indexOfFirstItem, indexOfLastItem);

    const mostRecentRecord = estadoLote.length > 0
        ? estadoLote.reduce((mostRecent, record) => {
            return new Date(record.fechaRegistro) > new Date(mostRecent.fechaRegistro) ? record : mostRecent;
        }, estadoLote[0])
        : null;

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

    // Componente de Paginación
    const Pagination = ({ totalPages, currentPage, paginate }) => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="flex justify-center mt-4">
                {pageNumbers.map((number) => (
                    <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`px-3 py-1 mx-1 border border-gray-300 rounded-md ${currentPage === number ? 'bg-green-700 text-white' : 'bg-white text-green-700 hover:bg-green-200'
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
        <div className="p-6 bg-yellow-50 shadow-lg rounded-lg max-w-full w-full">
            <div className="flex justify-start mb-6 text-lg">
                <Link to={`/produccionG/${idLote}`} state={{ estadoBaja }} className="text-green-700 hover:text-green-900 transition duration-300">Produccion</Link>
                <span className="mx-2 text-green-700">/</span>
                <Link to={`/clasificacion/${idLote}`} state={{ estadoBaja }} className="text-green-700 hover:text-green-900 transition duration-300">Clasificacion</Link>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-4 md:mb-6 text-center">Estado del Lote</h2>

            {!isLoteBaja && (
                <>
                    <div className="flex justify-center">
                        <button
                            disabled={isDisabled}
                            onClick={() => {
                                if (!isDisabled) {
                                    handleAddNew();
                                } else {
                                    alert('No puedes agregar una nueva clasificación porque el lote está dado de baja.');
                                }
                            }}
                            className={`px-6 py-3 text-white font-semibold rounded-lg transition-colors duration-300 ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800'} mb-6`}
                        >
                            {showForm ? 'Ocultar Formulario' : 'Agregar Nueva Clasificación'}
                        </button>
                    </div>


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
                </>
            )}

            {estadoLote.length > 0 ? (
                <>
                    <div className="w-full overflow-x-auto"> {/* Barra deslizable */}
                        <table className="w-full min-w-max bg-white border border-gray-200 rounded-lg shadow-md"> {/* Asegura que la tabla ocupe todo el ancho */}
                            <thead className="bg-green-700 text-white">
                                <tr>
                                    <th className="py-3 px-6 text-left text-sm font-semibold cursor-pointer hover:bg-green-800" onClick={handleSortByDate}>
                                        Fecha de Registro {sortDirection === 'asc' ? '▲' : '▼'}
                                    </th>
                                    <th className="py-3 px-6 text-left text-sm font-semibold">Cantidad de Gallinas</th>
                                    <th className="py-3 px-6 text-left text-sm font-semibold">Bajas</th>
                                    <th className="py-3 px-6 text-left text-sm font-semibold">Semana</th>
                                    <th className="py-3 px-6 text-left text-sm font-semibold">Etapa</th>
                                    <th className="py-3 px-6 text-left text-sm font-semibold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {currentItems.map((estado, index) => (
                                    <tr key={estado.idEstado} className={`border-b border-gray-200 hover:bg-yellow-50 ${mostRecentRecord && estado.idEstado === mostRecentRecord.idEstado ? 'bg-green-100' : ''}`}>
                                        <td className="py-3 px-6 whitespace-nowrap">{new Date(estado.fechaRegistro).toLocaleDateString()}</td>
                                        <td className="py-3 px-6 whitespace-nowrap">{estado.cantidadG}</td>
                                        <td className="py-3 px-6 whitespace-nowrap">{estado.bajas}</td>
                                        <td className="py-3 px-6 whitespace-nowrap">{estado.semana}</td>
                                        <td className="py-3 px-6 whitespace-nowrap">
                                            {estado.idEtapa === 1 ? 'Crianza' : estado.idEtapa === 2 ? 'Desarrollo' : 'Desconocido'}
                                        </td>
                                        <td className="py-3 px-6 whitespace-nowrap">
                                            {estado.idEstado === mostRecentRecord.idEstado && (
                                                <div className="flex space-x-3">
                                                    <button
                                                        onClick={() => {
                                                            if (!isDisabled) {
                                                                handleEdit(estado);
                                                            } else {
                                                                alert('No puedes editar porque el lote está dado de baja.');
                                                            }
                                                        }}
                                                        disabled={isDisabled}
                                                        className={`px-4 py-2 font-semibold rounded-lg transition-colors duration-300 ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 text-white hover:bg-yellow-600'
                                                            }`}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (!isDisabled) {
                                                                handleDelete(estado.idEstado);
                                                            } else {
                                                                alert('No puedes eliminar porque el lote está dado de baja.');
                                                            }
                                                        }}
                                                        disabled={isDisabled}
                                                        className={`px-4 py-2 font-semibold rounded-lg transition-colors duration-300 ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'
                                                            }`}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Componente de paginación */}
                    <Pagination totalPages={totalPages} currentPage={currentPage} paginate={paginate} />
                </>
            ) : (
                <p className="text-gray-700 text-lg">No hay registros de estado para este lote.</p>
            )}

        </div>
    );
};

export default EstadoLote;
