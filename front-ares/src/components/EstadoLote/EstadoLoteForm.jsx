import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EstadoLoteForm = ({ estadoData, isEditing, onSubmit, onCancel, idLote, isDisabled }) => {
    const [formData, setFormData] = useState({
        bajas: '',
        fechaRegistro: '',
        semana: '',
        idEtapa: '',
    });
    const [etapas, setEtapas] = useState([]);
    const [errors, setErrors] = useState({});

    const resetFormData = () => {
        if (estadoData) {
            setFormData({
                bajas: estadoData.bajas.toString(),
                fechaRegistro: estadoData.fechaRegistro ? estadoData.fechaRegistro.split('T')[0] : '',
                semana: estadoData.semana.toString(),
                idEtapa: estadoData.idEtapa.toString(),
            });
        }
    };

    useEffect(() => {
        const fetchEtapas = async () => {
            try {
                const response = await axios.get('https://localhost:7249/getetapas');
                setEtapas(response.data);
            } catch (error) {
                console.error('Error fetching etapas:', error);
            }
        };

        fetchEtapas();
    }, []);

    useEffect(() => {
        resetFormData(); // Recargar los datos del formulario al cambiar el estadoData
    }, [estadoData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.bajas || parseInt(formData.bajas, 10) < 0) {
            newErrors.bajas = 'El campo Bajas debe ser un número no negativo.';
        }

        if (!formData.semana || parseInt(formData.semana, 10) < 0) {
            newErrors.semana = 'El campo Semana debe ser un número no negativo.';
        }

        if (!formData.idEtapa) {
            newErrors.idEtapa = 'El campo Etapa es obligatorio.';
        }

        if (!isEditing && !formData.fechaRegistro) {
            newErrors.fechaRegistro = 'El campo Fecha de Registro es obligatorio.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                if (isEditing) {
                    await axios.put('https://localhost:7249/putestadolote', {
                        idEstado: estadoData.idEstado,
                        bajas: parseInt(formData.bajas, 10),
                        semana: parseInt(formData.semana, 10),
                        idEtapa: parseInt(formData.idEtapa, 10),
                        idLote: idLote,
                    });
                    alert('Estado del lote actualizado exitosamente');
                } else {
                    await axios.post('https://localhost:7249/postestadolote', {
                        bajas: parseInt(formData.bajas, 10),
                        fechaRegistro: formData.fechaRegistro,
                        semana: parseInt(formData.semana, 10),
                        idEtapa: parseInt(formData.idEtapa, 10),
                        idLote: idLote,
                    });
                    alert('Estado del lote creado exitosamente');
                }

                onSubmit();
            } catch (error) {
                if (error.response && error.response.data) {
                    alert(`Error al registrar clasificación: ${error.response.data.message || 'Error desconocido.'}`);
                } else {
                    alert('Error al registrar clasificación.');
                }
                console.error('Error al registrar clasificación:', error);
            }
        }
    };

    const handleClear = () => {
        setFormData({
            bajas: '',
            fechaRegistro: '',
            semana: '',
            idEtapa: '',
        });
        setErrors({});
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white shadow-lg rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-700">Bajas</label>
                    <input
                        type="number"
                        name="bajas"
                        value={formData.bajas}
                        onChange={handleChange}
                        disabled={isDisabled}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ingrese el número de bajas"
                    />
                    {errors.bajas && <p className="text-red-500 text-xs mt-2">{errors.bajas}</p>}
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-700">Semana</label>
                    <input
                        type="number"
                        name="semana"
                        value={formData.semana}
                        onChange={handleChange}
                        disabled={isDisabled}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ingrese la semana"
                    />
                    {errors.semana && <p className="text-red-500 text-xs mt-2">{errors.semana}</p>}
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-700">Etapa</label>
                    <select
                        name="idEtapa"
                        value={formData.idEtapa}
                        onChange={handleChange}
                        disabled={isDisabled}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="" disabled>Seleccione una etapa</option>
                        {etapas.map((etapa) => (
                            <option key={etapa.idEtapa} value={etapa.idEtapa}>
                                {etapa.nombre}
                            </option>
                        ))}
                    </select>
                    {errors.idEtapa && <p className="text-red-500 text-xs mt-2">{errors.idEtapa}</p>}
                </div>
                {!isEditing && (
                    <div className="col-span-1">
                        <label className="block text-sm font-semibold text-gray-700">Fecha de Registro</label>
                        <input
                            type="date"
                            name="fechaRegistro"
                            value={formData.fechaRegistro}
                            onChange={handleChange}
                            disabled={isDisabled}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.fechaRegistro && <p className="text-red-500 text-xs mt-2">{errors.fechaRegistro}</p>}
                    </div>
                )}
                {isEditing && (
                    <div className="col-span-1">
                        <label className="block text-sm font-semibold text-gray-700">Fecha de Registro</label>
                        <input
                            type="date"
                            name="fechaRegistro"
                            value={formData.fechaRegistro}
                            disabled
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
                        />
                        <p className="text-gray-500 text-xs mt-2">Este campo no se puede modificar.</p>
                    </div>
                )}
            </div>
            <div className="flex justify-end mt-6 space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isDisabled}
                    className={`px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 ${isDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 focus:ring-opacity-50'}`}
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    onClick={handleClear}
                    disabled={isDisabled}
                    className={`px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 ${isDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 focus:ring-opacity-50'}`}
                >
                    Limpiar
                </button>
                <button
                    type="submit"
                    disabled={isDisabled}
                    className={`px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 ${isDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 focus:ring-opacity-50'}`}
                >
                    {isEditing ? 'Actualizar Estado' : 'Crear Estado'}
                </button>
            </div>
        </form>
    );
};

export default EstadoLoteForm;
