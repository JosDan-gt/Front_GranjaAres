import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance'; // Importa la instancia de axios configurada

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
        await axiosInstance.put('/updproduccion', {
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
        await axiosInstance.post('/postproduccion', {
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
    <div className="p-4 md:p-6 rounded-lg shadow-md mb-6" style={{ backgroundColor: '#F5F5DC' }}>
      <h3 className="text-lg md:text-xl font-bold mb-4" style={{ color: '#8B4513' }}>
        {formData.idProd ? 'Actualizar Producción' : 'Agregar Producción'}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: '#8B4513' }}>Cajas</label>
            <input
              type="number"
              name="cantCajas"
              value={formData.cantCajas}
              onChange={handleChange}
              placeholder="Cajas"
              className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: '#8B4513', focusRingColor: '#6B8E23' }}
              min="0"
            />
            {errors.cantCajas && <p className="text-xs mt-1" style={{ color: '#B22222' }}>{errors.cantCajas}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: '#8B4513' }}>Cartones</label>
            <input
              type="number"
              name="cantCartones"
              value={formData.cantCartones}
              onChange={handleChange}
              placeholder="Cartones"
              className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: '#8B4513', focusRingColor: '#6B8E23' }}
              min="0"
            />
            {errors.cantCartones && <p className="text-xs mt-1" style={{ color: '#B22222' }}>{errors.cantCartones}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: '#8B4513' }}>Sueltos</label>
            <input
              type="number"
              name="cantSueltos"
              value={formData.cantSueltos}
              onChange={handleChange}
              placeholder="Sueltos"
              className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: '#8B4513', focusRingColor: '#6B8E23' }}
              min="0"
            />
            {errors.cantSueltos && <p className="text-xs mt-1" style={{ color: '#B22222' }}>{errors.cantSueltos}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: '#8B4513' }}>Defectuosos</label>
            <input
              type="number"
              name="defectuosos"
              value={formData.defectuosos}
              onChange={handleChange}
              placeholder="Defectuosos"
              className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: '#8B4513', focusRingColor: '#6B8E23' }}
              min="0"
            />
            {errors.defectuosos && <p className="text-xs mt-1" style={{ color: '#B22222' }}>{errors.defectuosos}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: '#8B4513' }}>Fecha de Registro</label>
            <input
              type="date"
              name="fechaRegistroP"
              value={formData.fechaRegistroP}
              onChange={handleChange}
              className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: '#8B4513', focusRingColor: '#6B8E23' }}
            />
            {errors.fechaRegistroP && <p className="text-xs mt-1" style={{ color: '#B22222' }}>{errors.fechaRegistroP}</p>}
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="px-4 py-2 font-semibold rounded-md focus:outline-none focus:ring-2"
            style={{ backgroundColor: '#6B8E23', color: '#FFFFFF', hoverBackgroundColor: '#5A7A1B', focusRingColor: '#6B8E23' }}
            disabled={loading}
          >
            {formData.idProd ? 'Actualizar' : 'Agregar'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 px-4 py-2 font-semibold rounded-md focus:outline-none focus:ring-2"
            style={{ backgroundColor: '#FFD700', color: '#FFFFFF', hoverBackgroundColor: '#E6C200', focusRingColor: '#FFD700' }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => setFormData({
              cantCajas: '',
              cantCartones: '',
              cantSueltos: '',
              defectuosos: '',
              fechaRegistroP: ''
            })}
            className="ml-2 px-4 py-2 font-semibold rounded-md focus:outline-none focus:ring-2"
            style={{ backgroundColor: '#808080', color: '#FFFFFF', hoverBackgroundColor: '#696969', focusRingColor: '#808080' }}
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );



};

export default ProduccionForm;
