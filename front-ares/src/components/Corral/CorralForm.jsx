import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CorralForm = ({ corralData, isEditing, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        idCorral: corralData?.idCorral || '',
        numCorral: corralData?.numCorral || '',
        capacidad: corralData?.capacidad || '',
        alto: corralData?.alto || '',
        ancho: corralData?.ancho || '',
        largo: corralData?.largo || '',
        agua: corralData?.agua || false,
        comederos: corralData?.comederos || '',
        bebederos: corralData?.bebederos || '',
        ponederos: corralData?.ponederos || '',
        estado: corralData?.estado || true,
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (corralData) {
            setFormData({
                idCorral: corralData.idCorral,
                numCorral: corralData.numCorral,
                capacidad: corralData.capacidad,
                alto: corralData.alto,
                ancho: corralData.ancho,
                largo: corralData.largo,
                agua: corralData.agua,
                comederos: corralData.comederos,
                bebederos: corralData.bebederos,
                ponederos: corralData.ponederos,
                estado: corralData.estado,
            });
        }
    }, [corralData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: checked,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.numCorral || formData.numCorral.trim() === '') {
            newErrors.numCorral = 'El número del corral es obligatorio.';
        }

        ['capacidad', 'alto', 'ancho', 'largo', 'comederos', 'bebederos', 'ponederos'].forEach(field => {
            if (!formData[field] || isNaN(formData[field]) || parseInt(formData[field], 10) < 0) {
                newErrors[field] = `El campo ${field} debe ser un número no negativo.`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const url = isEditing ? `https://localhost:7249/putcorral` : `https://localhost:7249/postcorral`;
                const method = isEditing ? 'put' : 'post';

                // Construye el payload sin incluir `idCorral` si no está definido o es una cadena vacía
                const payload = {
                    numCorral: formData.numCorral,
                    capacidad: parseInt(formData.capacidad, 10),
                    alto: parseInt(formData.alto, 10),
                    ancho: parseInt(formData.ancho, 10),
                    largo: parseInt(formData.largo, 10),
                    agua: formData.agua,
                    comederos: parseInt(formData.comederos, 10),
                    bebederos: parseInt(formData.bebederos, 10),
                    ponederos: parseInt(formData.ponederos, 10),
                    estado: formData.estado
                };

                // Solo agrega `idCorral` si se está actualizando un corral existente y `idCorral` tiene un valor
                if (isEditing && formData.idCorral) {
                    payload.idCorral = formData.idCorral;
                }

                console.log('Datos enviados:', payload);

                await axios[method](url, payload, {
                    headers: { 'Content-Type': 'application/json' }
                });

                alert(`Corral ${isEditing ? 'actualizado' : 'creado'} exitosamente`);

                if (onSubmit) {
                    onSubmit();
                }
            } catch (error) {
                console.error('Error al guardar el corral:', error);
                alert('Error al guardar el corral. Por favor, intenta nuevamente.');
            }
        }
    };



    const handleClear = () => {
        setFormData({
            idCorral: '',
            numCorral: '',
            capacidad: '',
            alto: '',
            ancho: '',
            largo: '',
            agua: false,
            comederos: '',
            bebederos: '',
            ponederos: '',
            estado: true,
        });
        setErrors({});
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white shadow-lg rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-700">Número de Corral</label>
                    <input
                        type="text"
                        name="numCorral"
                        value={formData.numCorral}
                        onChange={handleChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ingrese el número del corral"
                    />
                    {errors.numCorral && <p className="text-red-500 text-xs mt-2">{errors.numCorral}</p>}
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-700">Capacidad</label>
                    <input
                        type="number"
                        name="capacidad"
                        value={formData.capacidad}
                        onChange={handleChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ingrese la capacidad"
                    />
                    {errors.capacidad && <p className="text-red-500 text-xs mt-2">{errors.capacidad}</p>}
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-700">Alto</label>
                    <input
                        type="number"
                        name="alto"
                        value={formData.alto}
                        onChange={handleChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ingrese el alto"
                    />
                    {errors.alto && <p className="text-red-500 text-xs mt-2">{errors.alto}</p>}
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-700">Ancho</label>
                    <input
                        type="number"
                        name="ancho"
                        value={formData.ancho}
                        onChange={handleChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ingrese el ancho"
                    />
                    {errors.ancho && <p className="text-red-500 text-xs mt-2">{errors.ancho}</p>}
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-700">Largo</label>
                    <input
                        type="number"
                        name="largo"
                        value={formData.largo}
                        onChange={handleChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ingrese el largo"
                    />
                    {errors.largo && <p className="text-red-500 text-xs mt-2">{errors.largo}</p>}
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-700">Comederos</label>
                    <input
                        type="number"
                        name="comederos"
                        value={formData.comederos}
                        onChange={handleChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ingrese el número de comederos"
                    />
                    {errors.comederos && <p className="text-red-500 text-xs mt-2">{errors.comederos}</p>}
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-700">Bebederos</label>
                    <input
                        type="number"
                        name="bebederos"
                        value={formData.bebederos}
                        onChange={handleChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ingrese el número de bebederos"
                    />
                    {errors.bebederos && <p className="text-red-500 text-xs mt-2">{errors.bebederos}</p>}
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-700">Ponederos</label>
                    <input
                        type="number"
                        name="ponederos"
                        value={formData.ponederos}
                        onChange={handleChange}
                        className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ingrese el número de ponederos"
                    />
                    {errors.ponederos && <p className="text-red-500 text-xs mt-2">{errors.ponederos}</p>}
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-700">Agua</label>
                    <input
                        type="checkbox"
                        name="agua"
                        checked={formData.agua}
                        onChange={handleChange}
                        className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
                <button
                    type="button"
                    onClick={handleClear}
                    className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition duration-300"
                >
                    Limpiar
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
                >
                    {isEditing ? 'Actualizar' : 'Guardar'}
                </button>
            </div>
        </form>
    );
};

export default CorralForm;
