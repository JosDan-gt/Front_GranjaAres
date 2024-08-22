import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClasificacionForm = ({ idLote, onClose, isUpdateMode, item, refreshData }) => {
    const [formData, setFormData] = useState({
        tamano: '',
        cajas: '',
        cartonesExtras: '',
        huevosSueltos: '',
        fechaClaS: '',
        fechaProdu: '',
        idProd: null,
    });
    const [fechasProduccion, setFechasProduccion] = useState([]);
    const [selectedProduccion, setSelectedProduccion] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFechasProduccion = async () => {
            try {
                const responseViewStock = await axios.get(`https://localhost:7249/viewstock?idLote=${idLote}`);
                const fechasConStock = responseViewStock.data;

                let fechasFiltradas;

                if (isUpdateMode && item) {
                    const responseAllFechas = await axios.get(`https://localhost:7249/getproduccion?IdLote=${idLote}`);
                    const todasLasFechas = responseAllFechas.data;

                    const fechasCombinadas = todasLasFechas.map(fecha => {
                        const fechaConStock = fechasConStock.find(f => f.idProduccion === fecha.idProd);
                        return fechaConStock || {
                            idProduccion: fecha.idProd,
                            fechaProdu: fecha.fechaRegistroP,
                            cantidadTotalProduccion: fecha.cantidadTotalProduccion,
                            stockRestante: 0,
                            cajasRestantes: 0,
                            cartonesRestantes: 0,
                            huevosSueltosRestantes: 0,
                        };
                    });

                    // Filtrar para que solo muestre fechas únicas
                    fechasFiltradas = fechasCombinadas.reduce((acc, current) => {
                        const x = acc.find(item => item.fechaProdu === current.fechaProdu);
                        if (!x) {
                            return acc.concat([current]);
                        } else {
                            return acc;
                        }
                    }, []);

                    setFechasProduccion(fechasFiltradas);

                    const produccionSeleccionada = fechasFiltradas.find(f => f.idProduccion === item.idProd);
                    if (produccionSeleccionada) {
                        setFormData({
                            tamano: item.tamano || '',
                            cajas: item.cajas?.toString() || '0',
                            cartonesExtras: item.cartonesExtras?.toString() || '0',
                            huevosSueltos: item.huevosSueltos?.toString() || '0',
                            fechaClaS: item.fechaClaS ? new Date(item.fechaClaS).toISOString().split('T')[0] : '',
                            fechaProdu: produccionSeleccionada.fechaProdu,
                            idProd: produccionSeleccionada.idProduccion,
                        });
                        setSelectedProduccion(produccionSeleccionada);
                    }
                } else {
                    // Si no es modo de edición, solo mostrar fechas con stock
                    fechasFiltradas = fechasConStock.reduce((acc, current) => {
                        const x = acc.find(item => item.fechaProdu === current.fechaProdu);
                        if (!x) {
                            return acc.concat([current]);
                        } else {
                            return acc;
                        }
                    }, []);
                    setFechasProduccion(fechasFiltradas);
                }
            } catch (error) {
                console.error('Error fetching fechas de producción:', error);
            }
        };
        fetchFechasProduccion();
    }, [idLote, isUpdateMode, item]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'tamano') {
            const regex = /^[a-zA-Z\s]*$/;
            if (!regex.test(value)) return;
        }

        if (['cajas', 'cartonesExtras', 'huevosSueltos'].includes(name)) {
            const regex = /^[0-9]*$/;
            if (!regex.test(value)) return;
        }

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFechaProduChange = (e) => {
        const fechaSeleccionada = e.target.value;
        const produccionSeleccionada = fechasProduccion.find(f => f.fechaProdu === fechaSeleccionada);
        if (produccionSeleccionada) {
            setFormData({
                ...formData,
                fechaProdu: fechaSeleccionada,
                idProd: produccionSeleccionada.idProduccion,
            });
            setSelectedProduccion(produccionSeleccionada);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const regexLetters = /^[a-zA-Z\s]*$/;

        if (!formData.tamano) {
            newErrors.tamano = 'Este campo es obligatorio.';
        } else if (!regexLetters.test(formData.tamano)) {
            newErrors.tamano = 'El campo solo debe contener letras.';
        }

        if (formData.cajas === '' || parseInt(formData.cajas) < 0) {
            newErrors.cajas = 'El campo debe ser un número positivo o 0.';
        }

        if (formData.cartonesExtras === '' || parseInt(formData.cartonesExtras) < 0) {
            newErrors.cartonesExtras = 'El campo debe ser un número positivo o 0.';
        }

        if (formData.huevosSueltos === '' || parseInt(formData.huevosSueltos) < 0) {
            newErrors.huevosSueltos = 'El campo debe ser un número positivo o 0.';
        }

        if (!formData.fechaClaS) {
            newErrors.fechaClaS = 'Este campo es obligatorio.';
        }

        if (!formData.fechaProdu) {
            newErrors.fechaProdu = 'Este campo es obligatorio.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleReset = () => {
        setFormData({
            tamano: '',
            cajas: '',
            cartonesExtras: '',
            huevosSueltos: '',
            fechaClaS: '',
            fechaProdu: '',
            idProd: null,
        });
        setSelectedProduccion(null);
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const response = isUpdateMode
                ? await axios.put('https://localhost:7249/putclasificacion', {
                    Id: item?.id,
                    Tamano: formData.tamano,
                    Cajas: parseInt(formData.cajas),
                    CartonesExtras: parseInt(formData.cartonesExtras),
                    HuevosSueltos: parseInt(formData.huevosSueltos),
                    IdProd: formData.idProd,
                })
                : await axios.post('https://localhost:7249/postclasificacion', {
                    Tamano: formData.tamano,
                    Cajas: parseInt(formData.cajas),
                    CartonesExtras: parseInt(formData.cartonesExtras),
                    HuevosSueltos: parseInt(formData.huevosSueltos),
                    IdProd: formData.idProd,
                    FechaClaS: new Date(formData.fechaClaS).toISOString(),
                });

            alert(`Clasificación ${isUpdateMode ? 'actualizada' : 'registrada'} exitosamente.`);
            onClose();
            refreshData();
        } catch (error) {
            if (error.response && error.response.data) {
                alert(`Error al registrar clasificación: ${error.response.data.message || 'Error desconocido.'}`);
            } else {
                alert('Error al registrar clasificación.');
            }
            console.error('Error al registrar clasificación:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 p-6 bg-white rounded-lg shadow-md">
            <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {isUpdateMode ? 'Actualizar Clasificación' : 'Registrar Clasificación'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="col-span-1">
                            <label className="text-sm font-medium text-gray-700">Tamaño</label>
                            <input
                                type="text"
                                name="tamano"
                                value={formData.tamano}
                                onChange={handleChange}
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.tamano && <p className="text-red-500 text-xs mt-1">{errors.tamano}</p>}
                        </div>

                        <div className="col-span-1">
                            <label className="text-sm font-medium text-gray-700">Cajas</label>
                            <input
                                type="number"
                                name="cajas"
                                value={formData.cajas}
                                onChange={handleChange}
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.cajas && <p className="text-red-500 text-xs mt-1">{errors.cajas}</p>}
                        </div>

                        <div className="col-span-1">
                            <label className="text-sm font-medium text-gray-700">Cartones Extras</label>
                            <input
                                type="number"
                                name="cartonesExtras"
                                value={formData.cartonesExtras}
                                onChange={handleChange}
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.cartonesExtras && <p className="text-red-500 text-xs mt-1">{errors.cartonesExtras}</p>}
                        </div>

                        <div className="col-span-1">
                            <label className="text-sm font-medium text-gray-700">Huevos Sueltos</label>
                            <input
                                type="number"
                                name="huevosSueltos"
                                value={formData.huevosSueltos}
                                onChange={handleChange}
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.huevosSueltos && <p className="text-red-500 text-xs mt-1">{errors.huevosSueltos}</p>}
                        </div>

                        <div className="col-span-1">
                            <label className="text-sm font-medium text-gray-700">Fecha Clasificación</label>
                            <input
                                type="date"
                                name="fechaClaS"
                                value={formData.fechaClaS}
                                onChange={handleChange}
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.fechaClaS && <p className="text-red-500 text-xs mt-1">{errors.fechaClaS}</p>}
                        </div>

                        <div className="col-span-1">
                            <label className="text-sm font-medium text-gray-700">Fecha Producción</label>
                            <select
                                name="fechaProdu"
                                value={formData.fechaProdu}
                                onChange={handleFechaProduChange}
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Seleccione una fecha</option>
                                {fechasProduccion.map((fecha) => (
                                    <option key={fecha.idProduccion} value={fecha.fechaProdu}>
                                        {new Date(fecha.fechaProdu).toLocaleDateString()} - ID: {fecha.idProduccion}
                                    </option>
                                ))}
                            </select>
                            {errors.fechaProdu && <p className="text-red-500 text-xs mt-1">{errors.fechaProdu}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end mt-6 space-x-3">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                        >
                            Limpiar
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            {loading ? 'Guardando...' : isUpdateMode ? 'Actualizar' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="flex-1 p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 text-gray-700">Detalles de Producción</h3>
                {selectedProduccion ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                            <h4 className="font-semibold text-gray-600 mb-2">Fecha Producción</h4>
                            <p className="text-gray-800">{new Date(selectedProduccion.fechaProdu).toLocaleDateString()}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                            <h4 className="font-semibold text-gray-600 mb-2">Cantidad Total Producción</h4>
                            <p className="text-gray-800">{selectedProduccion.cantidadTotalProduccion}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                            <h4 className="font-semibold text-gray-600 mb-2">Stock Restante</h4>
                            <p className="text-gray-800">{selectedProduccion.stockRestante}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                            <h4 className="font-semibold text-gray-600 mb-2">Cajas Restantes</h4>
                            <p className="text-gray-800">{selectedProduccion.cajasRestantes}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                            <h4 className="font-semibold text-gray-600 mb-2">Cartones Restantes</h4>
                            <p className="text-gray-800">{selectedProduccion.cartonesRestantes}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                            <h4 className="font-semibold text-gray-600 mb-2">Huevos Sueltos Restantes</h4>
                            <p className="text-gray-800">{selectedProduccion.huevosSueltosRestantes}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600">Seleccione una fecha de producción para ver los detalles.</p>
                )}
            </div>
        </div>
    );

};

export default ClasificacionForm;
