import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';

const LotesDadosDeBaja = ({ reloadFlag, triggerReload }) => {
    const [lotesDadosDeBaja, setLotesDadosDeBaja] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/api/lotes?dadosDeBaja=true');
                setLotesDadosDeBaja(response.data || []);
            } catch (error) {
                console.error('Error fetching data:', error.response ? error.response.data : error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [reloadFlag]);

    const handleSelectionChange = (idLote, value) => {
        const selectedLote = lotesDadosDeBaja.find(lote => lote.idLote === idLote);

        if (!selectedLote) {
            alert('Lote no encontrado. Por favor, selecciona un lote válido.');
            return;
        }

        navigate(`/${value}/${idLote}`, { state: { estadoBaja: selectedLote.estadoBaja } });
    };

    

    const handleDarDeAlta = async (idLote) => {
        if (window.confirm("¿Estás seguro de que deseas dar de alta este lote?")) {
            try {
                await axiosInstance.put(`/api/lotes/putLoteBaja?idLote=${idLote}`, { estadoBaja: false });
                setLotesDadosDeBaja(lotesDadosDeBaja.filter(lote => lote.idLote !== idLote));
                alert('Lote dado de alta correctamente');
                triggerReload(); // Activar recarga en el componente padre
            } catch (error) {
                console.error('Error al dar de alta el lote:', error);
                alert('Error al dar de alta el lote');
            }
        }
    };

    if (isLoading) {
        return <p>Cargando datos, por favor espera...</p>;
    }

    return (
        <div className="p-4 sm:p-6 bg-red-50 shadow-lg rounded-lg">
            <h2 className="text-2xl sm:text-3xl font-bold text-green-900 mb-4 sm:mb-6">Lotes Dados de Baja</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {lotesDadosDeBaja.map((lote) => (
                    <div key={lote.idLote} className="border border-red-400 rounded-lg p-4 sm:p-6 bg-red-200 bg-opacity-50 shadow-sm hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-lg sm:text-xl font-semibold text-green-900 mb-2 sm:mb-4">Lote {lote.numLote}</h3>

                        <p className="text-green-700"><span className="font-medium text-green-900">Cantidad:</span> {lote.cantidadG}</p>
                        <p className="text-green-700"><span className="font-medium text-green-900">Fecha de Adquisición:</span> {new Date(lote.fechaAdq).toLocaleDateString()}</p>

                        <label htmlFor={`select-${lote.idLote}`} className="block text-sm font-medium text-green-900 mt-2 sm:mt-4 mb-2">
                            Acciones
                        </label>
                        <select
                            id={`select-${lote.idLote}`}
                            onChange={(e) => handleSelectionChange(lote.idLote, e.target.value)}
                            className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-900"
                            defaultValue=""
                        >
                            <option value="" disabled>Selecciona una opción</option>
                            <option value="produccionG">Producción</option>
                            <option value="clasificacion">Clasificación</option>
                            <option value="estado">Estado</option>
                        </select>

                        <div className="flex justify-between mt-2 sm:mt-4">
                            <button
                                onClick={() => handleDarDeAlta(lote.idLote)}
                                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                            >
                                Dar de Alta
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LotesDadosDeBaja;
