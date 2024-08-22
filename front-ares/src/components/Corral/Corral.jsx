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

        fetchCorrales();
    }, [sortOrder]);

    const sortData = (data) => {
        return data.sort((a, b) => {
            const numA = parseInt(a.numCorral, 10);
            const numB = parseInt(b.numCorral, 10);
            return sortOrder === 'asc' ? numA - numB : numB - numA;
        });
    };

    const handleSortChange = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const formatBoolean = (value) => {
        return value ? 'Sí' : 'No';
    };

    const handleUpdate = (corral) => {
        setSelectedCorral(corral);
        setShowForm(true);
    };

    const handleAddNew = () => {
        setSelectedCorral(null);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setSelectedCorral(null);
    };

    // Cálculo de los elementos de la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = corrales.slice(indexOfFirstItem, indexOfLastItem);

    // Cambio de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg max-w-full w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Lista de Corrales</h2>

            <button
                onClick={handleAddNew}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
                Agregar Nuevo Corral
            </button>

            {showForm && (
                <CorralForm
                    
                    isEditing={false}
                    corralData={null}
                    onCancel={() => console.log('Cancelado')}
                />
            )}

            <div className="w-full overflow-x-auto">
                <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden text-center">
                    <thead className="bg-gray-100">
                        <tr>
                            <th
                                className="py-3 px-6 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200"
                                onClick={handleSortChange}
                            >
                                Número de Corral {sortOrder === 'asc' ? '▲' : '▼'}
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
                            currentItems.map((corral) => (
                                <tr key={corral.idCorral} className="border-b border-gray-200">
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
                                            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-300"
                                        >
                                            Actualizar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="py-3 px-6 text-center">No hay corrales disponibles.</td>
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
                    Página {currentPage} de {Math.ceil(corrales.length / itemsPerPage)}
                </span>

                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage * itemsPerPage >= corrales.length}
                    className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-300"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default Corral;
