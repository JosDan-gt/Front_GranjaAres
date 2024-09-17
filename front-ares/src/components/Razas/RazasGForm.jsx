import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { FaSave, FaUndo, FaTimes } from 'react-icons/fa'; // Importamos los iconos

const RazaForm = ({ raza, onClose }) => {
  const [formData, setFormData] = useState({
    idRaza: raza?.idRaza || 0,
    raza: raza?.raza || '',
    origen: raza?.origen || '',
    color: raza?.color || '',
    colorH: raza?.colorH || '',
    caractEspec: raza?.caractEspec || ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      idRaza: raza?.idRaza || 0,
      raza: raza?.raza || '',
      origen: raza?.origen || '',
      color: raza?.color || '',
      colorH: raza?.colorH || '',
      caractEspec: raza?.caractEspec || ''
    });
  }, [raza]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.raza || formData.raza.trim().length < 3) {
      newErrors.raza = 'La raza es requerida y debe tener al menos 3 caracteres.';
    }

    if (!formData.origen || formData.origen.trim().length < 3) {
      newErrors.origen = 'El origen es requerido y debe tener al menos 3 caracteres.';
    }

    if (!formData.color || formData.color.trim().length < 3) {
      newErrors.color = 'El color es requerido y debe tener al menos 3 caracteres.';
    }

    if (!formData.colorH || formData.colorH.trim().length < 3) {
      newErrors.colorH = 'El color del huevo es requerido y debe tener al menos 3 caracteres.';
    }

    if (!formData.caractEspec || formData.caractEspec.trim().length < 2) {
      newErrors.caractEspec = 'Las características específicas son requeridas.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      if (raza) {
        await axiosInstance.put('/api/razaG/putraza', {
          idRaza: formData.idRaza,
          raza: formData.raza,
          origen: formData.origen,
          color: formData.color,
          colorH: formData.colorH,
          caractEspec: formData.caractEspec
        });
      } else {
        await axiosInstance.post('/api/razaG/postraza', {
          raza: formData.raza,
          origen: formData.origen,
          color: formData.color,
          colorH: formData.colorH,
          caractEspec: formData.caractEspec
        });
      }

      setLoading(false);
      onClose(); // Cierra el formulario si la actualización o creación es exitosa
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 shadow-xl rounded-xl">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-6 text-center tracking-wider">
        {raza ? 'Actualizar Raza de Gallina' : 'Registrar Raza de Gallina'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="col-span-1">
            <label className="text-sm font-medium text-green-900">Raza</label>
            <input
              type="text"
              name="raza"
              value={formData.raza || ''}
              onChange={handleChange}
              className={`w-full p-2 mt-1 border ${errors.raza ? 'border-red-500' : 'border-green-700'} rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500`}
            />
            {errors.raza && <p className="text-red-500 text-xs mt-1">{errors.raza}</p>}
          </div>

          <div className="col-span-1">
            <label className="text-sm font-medium text-green-900">Origen</label>
            <input
              type="text"
              name="origen"
              value={formData.origen || ''}
              onChange={handleChange}
              className={`w-full p-2 mt-1 border ${errors.origen ? 'border-red-500' : 'border-green-700'} rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500`}
            />
            {errors.origen && <p className="text-red-500 text-xs mt-1">{errors.origen}</p>}
          </div>

          <div className="col-span-1">
            <label className="text-sm font-medium text-green-900">Color</label>
            <input
              type="text"
              name="color"
              value={formData.color || ''}
              onChange={handleChange}
              className={`w-full p-2 mt-1 border ${errors.color ? 'border-red-500' : 'border-green-700'} rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500`}
            />
            {errors.color && <p className="text-red-500 text-xs mt-1">{errors.color}</p>}
          </div>

          <div className="col-span-1">
            <label className="text-sm font-medium text-green-900">Color Huevo</label>
            <input
              type="text"
              name="colorH"
              value={formData.colorH || ''}
              onChange={handleChange}
              className={`w-full p-2 mt-1 border ${errors.colorH ? 'border-red-500' : 'border-green-700'} rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500`}
            />
            {errors.colorH && <p className="text-red-500 text-xs mt-1">{errors.colorH}</p>}
          </div>

          <div className="col-span-2">
            <label className="text-sm font-medium text-green-900">Características Específicas</label>
            <textarea
              name="caractEspec"
              value={formData.caractEspec || ''}
              onChange={handleChange}
              className={`w-full p-2 mt-1 border ${errors.caractEspec ? 'border-red-500' : 'border-green-700'} rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500`}
              rows="4"
            />
            {errors.caractEspec && <p className="text-red-500 text-xs mt-1">{errors.caractEspec}</p>}
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <button
            type="button"
            onClick={() => setFormData({ raza: '', origen: '', color: '', colorH: '', caractEspec: '' })}
            className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 flex items-center"
          >
            <FaUndo className="mr-2" /> Limpiar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center"
          >
            <FaTimes className="mr-2" /> Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center"
          >
            <FaSave className="mr-2" /> {loading ? 'Guardando...' : raza ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RazaForm;
