import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CorralForm from './CorralForm'; // Importa el formulario

const Corral = () => {
    const [corrales, setCorrales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortOrder, setSortOrder] = useState('asc');
    const [showForm, setShowForm] = useState(false);
    const [selectedCorral, setSelectedCorral] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [lotes, setLotes] = useState([]);

    useEffect(() => {
        const fetchCorrales = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://localhost:7249/getcorral');
                const data = Array.isArray(response.data) ? response.data : [response.data];
                setCorrales(sortData(data));
            } catch (error) {
                console.error('Error fetching corrales:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchLotes = async () => {
            try {
                const response = await axios.get('https://localhost:7249/getlotes');
                setLotes(response.data);
            } catch (error) {
                console.error('Error fetching lotes:', error);
            }
        };

        fetchCorrales();
        fetchLotes();
    }, [sortOrder]);

    const sortData = (data) => {
        return data.sort((a, b) => {
            const numA = parseInt(a.numCorral, 10);
            const numB = parseInt(b.numCorral, 10);
            return sortOrder === 'asc' ? numA - numB : numB - numA;
        });
    };

    const isCorralInUse = (corralId) => {
        return lotes.some(lote => lote.idCorral === corralId && !lote.estadoBaja);
    };

    const formatBoolean = (value) => {
        return value ? 'Sí' : 'No';
    };

    const handleSortChange = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleUpdate = (corral) => {
        setSelectedCorral(corral);
        setIsEditing(true); // Modo edición
        setShowForm(true);
    };

    const handleAddNew = () => {
        setSelectedCorral(null);
        setIsEditing(false); // Modo creación
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setSelectedCorral(null);
        setIsEditing(false);
    };

    const handleFormSubmit = () => {
        // Oculta el formulario y resetea el estado
        setShowForm(false);
        setSelectedCorral(null);
        setIsEditing(false);

        // Refresca la lista de corrales después de guardar o actualizar un corral
        axios.get('https://localhost:7249/getcorral')
            .then(response => {
                const data = Array.isArray(response.data) ? response.data : [response.data];
                setCorrales(sortData(data)); // Actualiza la lista de corrales
            })
            .catch(error => console.error('Error al refrescar los corrales:', error));
    };

    const handleStatusChange = async (corral, newState) => {
        const confirmChange = window.confirm(`¿Estás seguro de que deseas ${newState ? 'habilitar' : 'inhabilitar'} este corral?`);
        if (confirmChange) {
            try {
                await axios.put(`https://localhost:7249/updestadocorral?id=${corral.idCorral}`, {
                    estado: newState,
                });
                alert(`Corral ${newState ? 'habilitado' : 'inhabilitado'} exitosamente`);
                handleFormSubmit();
            } catch (error) {
                console.error(`Error al ${newState ? 'habilitar' : 'inhabilitar'} el corral:`, error.response?.data || error.message);
                alert(`Error al ${newState ? 'habilitar' : 'inhabilitar'} el corral`);
            }
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filtra los corrales según el término de búsqueda
    const filteredCorrales = corrales.filter(corral =>
        corral.numCorral.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Dividir corrales en activos e inhabilitados
    const activeCorrales = filteredCorrales.filter(corral => corral.estado);
    const inactiveCorrales = filteredCorrales.filter(corral => !corral.estado);

    // Cálculo de los elementos de la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = activeCorrales.slice(indexOfFirstItem, indexOfLastItem);

    // Cambio de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg max-w-full w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Lista de Corrales</h2>

            <div className="flex mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Buscar corral"
                    style={{ width: '250px' }} // Ajusta el tamaño del buscador
                />
            </div>

            <button
                onClick={handleAddNew}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
                Agregar Nuevo Corral
            </button>

            {showForm && (
                <CorralForm
                    isEditing={isEditing}
                    corralData={selectedCorral}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormClose}
                />
            )}

            <div className="w-full overflow-x-auto">
                <h3 className="text-2xl font-bold text-gray-700 mb-4">Corrales Activos</h3>
                <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden text-center">
                    <thead className="bg-gray-100">
                        <tr>
                            <th
                                className="py-3 px-6 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200"
                                onClick={handleSortChange}
                            >
                                Corral {sortOrder === 'asc' ? '▲' : '▼'}
                            </th>
                            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Capacidad</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Alto (m)</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Ancho (m)</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Largo (m)</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Agua</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Comederos</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Bebederos</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Ponederos</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        {loading ? (
                            <tr>
                                <td colSpan="10" className="py-3 px-6 text-center">Cargando...</td>
                            </tr>
                        ) : currentItems.length ? (
                            currentItems.map((corral) => {
                                const inUse = isCorralInUse(corral.idCorral);
                                return (
                                    <tr
                                        key={corral.idCorral}
                                        className={`border-b border-gray-200 ${inUse ? 'bg-yellow-100' : ''}`}
                                    >
                                        <td className="py-3 px-6 whitespace-nowrap">{corral.numCorral}</td>
                                        <td className="py-3 px-6 whitespace-nowrap">{corral.capacidad}</td>
                                        <td className="py-3 px-6 whitespace-nowrap">{corral.alto}</td>
                                        <td className="py-3 px-6 whitespace-nowrap">{corral.ancho}</td>
                                        <td className="py-3 px-6 whitespace-nowrap">{corral.largo}</td>
                                        <td className="py-3 px-6 whitespace-nowrap">{formatBoolean(corral.agua)}</td>
                                        <td className="py-3 px-6 whitespace-nowrap">{corral.comederos}</td>
                                        <td className="py-3 px-6 whitespace-nowrap">{corral.bebederos}</td>
                                        <td className="py-3 px-6 whitespace-nowrap">{corral.ponederos}</td>
                                        <td className="py-3 px-6 whitespace-nowrap">
                                            <button
                                                onClick={() => handleUpdate(corral)}
                                                className="mr-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-300"
                                            >
                                                Actualizar
                                            </button>
                                            <select
                                                onChange={(e) => handleStatusChange(corral, e.target.value === 'habilitar')}
                                                value={corral.estado ? 'habilitar' : 'inhabilitar'}
                                                className="px-4 py-2 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors duration-300"
                                                disabled={inUse}
                                            >
                                                <option value="habilitar">Habilitar</option>
                                                <option value="inhabilitar">Inhabilitar</option>
                                            </select>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="10" className="py-3 px-6 text-center">No hay corrales disponibles.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="w-full overflow-x-auto mt-8">
                <h3 className="text-2xl font-bold text-gray-700 mb-4">Corrales Inhabilitados</h3>
                <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden text-center">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Corral</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Capacidad</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Alto (m)</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Ancho (m)</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Largo (m)</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Agua</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Comederos</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Bebederos</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Ponederos</th>
                            <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        {inactiveCorrales.length ? (
                            inactiveCorrales.map((corral) => (
                                <tr key={corral.idCorral} className="border-b border-gray-200 bg-red-100">
                                    <td className="py-3 px-6 whitespace-nowrap">{corral.numCorral}</td>
                                    <td className="py-3 px-6 whitespace-nowrap">{corral.capacidad}</td>
                                    <td className="py-3 px-6 whitespace-nowrap">{corral.alto}</td>
                                    <td className="py-3 px-6 whitespace-nowrap">{corral.ancho}</td>
                                    <td className="py-3 px-6 whitespace-nowrap">{corral.largo}</td>
                                    <td className="py-3 px-6 whitespace-nowrap">{formatBoolean(corral.agua)}</td>
                                    <td className="py-3 px-6 whitespace-nowrap">{corral.comederos}</td>
                                    <td className="py-3 px-6 whitespace-nowrap">{corral.bebederos}</td>
                                    <td className="py-3 px-6 whitespace-nowrap">{corral.ponederos}</td>
                                    <td className="py-3 px-6 whitespace-nowrap">
                                        <select
                                            onChange={(e) => handleStatusChange(corral, e.target.value === 'habilitar')}
                                            value="inhabilitar"
                                            className="px-4 py-2 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors duration-300"
                                        >
                                            <option value="habilitar">Habilitar</option>
                                            <option value="inhabilitar" disabled>Inhabilitado</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="py-3 px-6 text-center">No hay corrales inhabilitados.</td>
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
                    Página {currentPage} de {Math.ceil(activeCorrales.length / itemsPerPage)}
                </span>

                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage * itemsPerPage >= activeCorrales.length}
                    className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-300"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default Corral;
