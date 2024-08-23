import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProduccionForm = ({ item, idLote, onClose, refreshData }) => {
  const [formData, setFormData] = useState({
    idProd: '',
    cantCajas: '',
    cantCartones: '',
    cantSueltos: '',
    defectuosos: '',
    fechaRegistroP: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
        fechaRegistroP: item.fechaRegistroP ? item.fechaRegistroP.split('T')[0] : ''
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.cantCajas === '') newErrors.cantCajas = 'Este campo es obligatorio.';
    if (formData.cantCartones === '') newErrors.cantCartones = 'Este campo es obligatorio.';
    if (formData.cantSueltos === '') newErrors.cantSueltos = 'Este campo es obligatorio.';
    if (formData.defectuosos === '') newErrors.defectuosos = 'Este campo es obligatorio.';
    if (!formData.fechaRegistroP) newErrors.fechaRegistroP = 'Este campo es obligatorio.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    try {
      if (formData.idProd) {
        await axios.put('https://localhost:7249/updproduccion', {
          IdProd: formData.idProd,
          CantCajas: parseInt(formData.cantCajas),
          CantCartones: parseInt(formData.cantCartones),
          CantSueltos: parseInt(formData.cantSueltos),
          IdLote: idLote,
          Defectuosos: parseInt(formData.defectuosos),
          FechaRegistroP: formData.fechaRegistroP ? new Date(formData.fechaRegistroP).toISOString() : null
        });
        alert('Producción actualizada exitosamente.');
      } else {
        await axios.post('https://localhost:7249/postproduccion', {
          CantCajas: parseInt(formData.cantCajas),
          CantCartones: parseInt(formData.cantCartones),
          CantSueltos: parseInt(formData.cantSueltos),
          IdLote: idLote,
          Defectuosos: formData.defectuosos ? parseInt(formData.defectuosos) : null,
          FechaRegistroP: formData.fechaRegistroP ? new Date(formData.fechaRegistroP).toISOString() : null
        });
        alert('Producción registrada exitosamente.');
      }
      setFormData({
        idProd: '',
        cantCajas: '',
        cantCartones: '',
        cantSueltos: '',
        defectuosos: '',
        fechaRegistroP: '',
      });
      onClose();
      refreshData();
    } catch (error) {
      if (error.response && error.response.data) {
        alert(`Error al registrar producción: ${error.response.data.message || 'Error desconocido.'}`);
      } else {
        alert('Error al registrar producción.');
      }
      console.error('Error al registrar producción:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-full w-full">
      <h3 className="text-3xl font-bold text-gray-800 mb-6">
        {formData.idProd ? 'Actualizar Producción' : 'Agregar Producción'}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cajas</label>
            <input
              type="number"
              name="cantCajas"
              value={formData.cantCajas}
              onChange={handleChange}
              placeholder="Cajas"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
            />
            {errors.cantCajas && <p className="text-red-500 text-xs mt-2">{errors.cantCajas}</p>}
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cartones</label>
            <input
              type="number"
              name="cantCartones"
              value={formData.cantCartones}
              onChange={handleChange}
              placeholder="Cartones"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
            />
            {errors.cantCartones && <p className="text-red-500 text-xs mt-2">{errors.cantCartones}</p>}
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sueltos</label>
            <input
              type="number"
              name="cantSueltos"
              value={formData.cantSueltos}
              onChange={handleChange}
              placeholder="Sueltos"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
            />
            {errors.cantSueltos && <p className="text-red-500 text-xs mt-2">{errors.cantSueltos}</p>}
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Defectuosos</label>
            <input
              type="number"
              name="defectuosos"
              value={formData.defectuosos}
              onChange={handleChange}
              placeholder="Defectuosos"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="0"
            />
            {errors.defectuosos && <p className="text-red-500 text-xs mt-2">{errors.defectuosos}</p>}
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha de Registro</label>
            <input
              type="date"
              name="fechaRegistroP"
              value={formData.fechaRegistroP}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.fechaRegistroP && <p className="text-red-500 text-xs mt-2">{errors.fechaRegistroP}</p>}
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
            disabled={loading}
          >
            {formData.idProd ? 'Actualizar' : 'Agregar'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-300"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );

};

export default ProduccionForm;
