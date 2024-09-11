import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance'; // Importa la instancia de axios configurada
import { useParams, Link } from 'react-router-dom';
import EstadoLoteForm from './EstadoLoteForm'; // Importa el formulario
import { useLocation } from 'react-router-dom';

const EstadoLote = () => {
    const { idLote } = useParams(); // Obtén el ID del Lote desde la URL
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
        // Función para obtener el estado de los registros de 'EstadoLote'
        const fetchEstadoLote = async () => {
            try {
                const response = await axiosInstance.get(`/getestadolote?idLote=${idLote}`);
                const sortedData = response.data.sort((a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro));
                setEstadoLote(sortedData);
            } catch (error) {
                console.error('Error fetching estadoLote:', error);
            }
        };

        // Función para obtener el estado del lote (si está dado de baja o no)
        const fetchLoteStatus = async () => {
            try {
                const response = await axiosInstance.get(`/getlote?idLote=${idLote}`); // Cambia a tu endpoint adecuado
                setIsLoteBaja(response.data.estadoBaja); // Almacena el estado de baja del lote
            } catch (error) {
                console.error('Error fetching lote status:', error);
            }
        };

        // Si tenemos un ID de lote, cargamos los datos
        if (idLote) {
            fetchEstadoLote();
            fetchLoteStatus(); // Verifica el estado del lote
        }
    }, [idLote]);

    // Función para manejar el botón de agregar un nuevo estado
    const handleAddNew = () => {
        if (showForm) {
            handleFormClose();
        } else {
            setSelectedEstado(null);
            setIsEditing(false);
            setShowForm(true);
        }
    };

    // Función para manejar la edición de un estado existente
    const handleEdit = (estado) => {
        setSelectedEstado(estado);
        setIsEditing(true);
        setShowForm(true);
    };

    // Función para cerrar el formulario
    const handleFormClose = () => {
        setShowForm(false);
        setIsEditing(false); // Restablece el estado de edición
        setSelectedEstado(null); // Limpia el estado seleccionado
    };

    // Paginación
    const handleNextPage = () => {
        if (currentPage < Math.ceil(estadoLote.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Ordenación por fecha de registro
    const handleSortByDate = () => {
        const sortedData = [...estadoLote].sort((a, b) => {
            if (sortDirection === 'asc') {
                return new Date(a.fechaRegistro) - new Date(b.fechaRegistro);
            } else {
                return new Date(b.fechaRegistro) - new Date(a.fechaRegistro);
            }
        });
        setEstadoLote(sortedData);
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    // Función para manejar la eliminación de un estado
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

    // Lógica para manejar la visualización paginada
    const totalPages = Math.ceil(estadoLote.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = estadoLote.slice(indexOfFirstItem, indexOfLastItem);

    // Obtener el registro más reciente
    const mostRecentRecord = estadoLote.reduce((mostRecent, record) => {
        return new Date(record.fechaRegistro) > new Date(mostRecent.fechaRegistro) ? record : mostRecent;
    }, estadoLote[0]);

    // Lógica para manejar el envío del formulario
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

    return (
        <div className="p-6 bg-yellow-50 shadow-lg rounded-lg max-w-full w-full">
            <div className="flex justify-start mb-6 text-lg">
                <Link
                    to={`/produccionG/${idLote}`}
                    className="text-green-700 hover:text-green-900 transition duration-300"
                >
                    Produccion
                </Link>
                <span className="mx-2 text-green-700">/</span>
                <Link
                    to={`/clasificacion/${idLote}`}
                    className="text-green-700 hover:text-green-900 transition duration-300"
                >
                    Clasificacion
                </Link>
            </div>
            <h2 className="text-3xl font-bold text-green-900 mb-6">Estado del Lote {idLote}</h2>

            {!isLoteBaja && (
                <>
                    <button
                        disabled={isDisabled}
                        onClick={handleAddNew}
                        className={`px-6 py-3 text-white font-semibold rounded-lg transition-colors duration-300 ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800'} mb-6`}
                    >
                        {showForm ? 'Ocultar Formulario' : 'Agregar Nueva Clasificación'}
                    </button>

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
                    <div className="w-full overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                            <thead className="bg-green-700 text-white">
                                <tr>
                                    <th
                                        className="py-3 px-6 text-left text-sm font-semibold cursor-pointer hover:bg-green-800"
                                        onClick={handleSortByDate}
                                    >
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
                                {currentItems.map((estado) => (
                                    <tr
                                        key={estado.idEstado}
                                        className={`border-b border-gray-200 hover:bg-yellow-50 ${estado.idEstado === mostRecentRecord.idEstado ? 'bg-green-100' : ''}`}
                                    >
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
                                                        onClick={() => handleEdit(estado)}
                                                        className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors duration-300"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(estado.idEstado)}
                                                        className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-300"
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
                    <div className="flex justify-between items-center mt-6">
                        <button
                            onClick={handlePrevPage}
                            className="px-6 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors duration-300"
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </button>

                        <span className="text-lg text-green-900">
                            Página {currentPage} de {totalPages}
                        </span>

                        <button
                            onClick={handleNextPage}
                            className="px-6 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors duration-300"
                            disabled={currentPage >= totalPages}
                        >
                            Siguiente
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-gray-700 text-lg">No hay registros de estado para este lote.</p>
            )}
        </div>
    );


};

export default EstadoLote;
