import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

const ClienteForm = ({ onCancel, onSubmit, cliente }) => {
  const [formData, setFormData] = useState({
    nombreCliente: '',
    direccion: '',
    telefono: ''
  });

  const [errors, setErrors] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (cliente) {
      setFormData({
        nombreCliente: cliente.nombreCliente,
        direccion: cliente.direccion,
        telefono: cliente.telefono,
      });
    }
  }, [cliente]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let formIsValid = true;
    let errors = {};

    if (!formData.nombreCliente.trim()) {
      formIsValid = false;
      errors.nombreCliente = 'El nombre del cliente es requerido.';
    }

    if (!formData.telefono.trim()) {
      formIsValid = false;
      errors.telefono = 'El teléfono es requerido.';
    }

    if (!formData.direccion.trim()) {
      formIsValid = false;
      errors.direccion = 'La dirección es requerida.';
    }

    setErrors(errors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsDisabled(true);

    try {
      if (cliente) {
        // Actualizar cliente existente
        await axiosInstance.put('/api/Ventas/updCliente', { clienteId: cliente.clienteId, ...formData });
      } else {
        // Insertar nuevo cliente
        await axiosInstance.post('/api/Ventas/insertCliente', formData);
      }
      onSubmit(); // Llamar a la función onSubmit pasada como prop
    } catch (error) {
      console.error('Error al insertar o actualizar el cliente:', error);
    } finally {
      setIsDisabled(false);
    }
  };


  const handleClear = () => {
    setFormData({
      nombreCliente: '',
      direccion: '',
      telefono: ''
    });
    setErrors({});
  };

  return (
    <div className="flex items-start space-x-6 p-6 bg-yellow-50 shadow-lg rounded-lg mb-4" style={{ backgroundColor: '#F5F5DC' }}>
      <form onSubmit={handleSubmit} className="space-y-6 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-green-900">Nombre del Cliente</label>
            <input
              type="text"
              name="nombreCliente"
              value={formData.nombreCliente}
              onChange={handleChange}
              disabled={isDisabled}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
              placeholder="Ingrese el nombre del cliente"
            />
            {errors.nombreCliente && <p className="text-red-600 text-xs mt-2">{errors.nombreCliente}</p>}
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-green-900">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={(e) => {
                if (e.target.value.length <= 8) {
                  handleChange(e);
                }
              }}
              disabled={isDisabled}
              inputMode="numeric"
              pattern="\d{8}"
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
              placeholder="Ingrese el teléfono"
            />
            {errors.telefono && <p className="text-red-600 text-xs mt-2">{errors.telefono}</p>}
          </div>


          <div className="col-span-2">
            <label className="block text-sm font-semibold text-green-900">Dirección</label>
            <textarea
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              disabled={isDisabled}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
              placeholder="Ingrese la dirección"
              rows="3"
            />
            {errors.direccion && <p className="text-red-600 text-xs mt-2">{errors.direccion}</p>}
          </div>
        </div>
      </form>
      <div className="flex flex-col space-y-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isDisabled}
          className={`px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 ${isDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 focus:ring-opacity-50'
            }`}
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleClear}
          disabled={isDisabled}
          className={`px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 ${isDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 focus:ring-opacity-50'
            }`}
        >
          Limpiar
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isDisabled}
          className={`px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 ${isDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 focus:ring-opacity-50'
            }`}
        >
          {cliente ? 'Actualizar Cliente' : 'Insertar Cliente'}
        </button>
      </div>
    </div>
  );
};

export default ClienteForm;
