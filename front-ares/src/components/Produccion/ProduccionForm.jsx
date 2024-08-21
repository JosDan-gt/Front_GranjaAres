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
    if (!formData.cantCajas) newErrors.cantCajas = 'Este campo es obligatorio.';
    if (!formData.cantCartones) newErrors.cantCartones = 'Este campo es obligatorio.';
    if (!formData.cantSueltos) newErrors.cantSueltos = 'Este campo es obligatorio.';
    if (!formData.defectuosos) newErrors.defectuosos = 'Este campo es obligatorio.';
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
    <div className="p-4 bg-white border border-gray-200 rounded shadow-md">
      <h3 className="text-xl font-semibold mb-4">{formData.idProd ? 'Actualizar Producción' : 'Agregar Producción'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 mb-4">
          <div className="flex flex-col w-1/6">
            <label className="text-sm font-medium mb-1">Cajas</label>
            <input
              type="number"
              name="cantCajas"
              value={formData.cantCajas}
              onChange={handleChange}
              placeholder="Cajas"
              className="p-2 border border-gray-300 rounded text-sm"
              min="0"
            />
            {errors.cantCajas && <p className="text-red-500 text-xs mt-1">{errors.cantCajas}</p>}
          </div>

          <div className="flex flex-col w-1/6">
            <label className="text-sm font-medium mb-1">Cartones</label>
            <input
              type="number"
              name="cantCartones"
              value={formData.cantCartones}
              onChange={handleChange}
              placeholder="Cartones"
              className="p-2 border border-gray-300 rounded text-sm"
              min="0"
            />
            {errors.cantCartones && <p className="text-red-500 text-xs mt-1">{errors.cantCartones}</p>}
          </div>

          <div className="flex flex-col w-1/6">
            <label className="text-sm font-medium mb-1">Sueltos</label>
            <input
              type="number"
              name="cantSueltos"
              value={formData.cantSueltos}
              onChange={handleChange}
              placeholder="Sueltos"
              className="p-2 border border-gray-300 rounded text-sm"
              min="0"
            />
            {errors.cantSueltos && <p className="text-red-500 text-xs mt-1">{errors.cantSueltos}</p>}
          </div>

          <div className="flex flex-col w-1/6">
            <label className="text-sm font-medium mb-1">Defectuosos</label>
            <input
              type="number"
              name="defectuosos"
              value={formData.defectuosos}
              onChange={handleChange}
              placeholder="Defectuosos"
              className="p-2 border border-gray-300 rounded text-sm"
              min="0"
            />
            {errors.defectuosos && <p className="text-red-500 text-xs mt-1">{errors.defectuosos}</p>}
          </div>

          <div className="flex flex-col w-1/6">
            <label className="text-sm font-medium mb-1">Fecha de Registro</label>
            <input
              type="date"
              name="fechaRegistroP"
              value={formData.fechaRegistroP}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded text-sm"
            />
            {errors.fechaRegistroP && <p className="text-red-500 text-xs mt-1">{errors.fechaRegistroP}</p>}
          </div>
        </div>
        <div className="mt-4">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded mr-2" disabled={loading}>
            {formData.idProd ? 'Actualizar' : 'Agregar'}
          </button>
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProduccionForm;
