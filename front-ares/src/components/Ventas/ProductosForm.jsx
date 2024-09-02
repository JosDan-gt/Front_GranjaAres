import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

const ProductoForm = ({ onCancel, onSubmit, producto }) => {
  const [formData, setFormData] = useState({
    nombreProducto: '',
    descripcion: '',
  });

  const [errors, setErrors] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (producto) {
      setFormData({
        nombreProducto: producto.nombreProducto,
        descripcion: producto.descripcion,
      });
    }
  }, [producto]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let formIsValid = true;
    let errors = {};

    if (!formData.nombreProducto.trim()) {
      formIsValid = false;
      errors.nombreProducto = 'El nombre del producto es requerido.';
    }

    if (!formData.descripcion.trim()) {
      formIsValid = false;
      errors.descripcion = 'La descripción es requerida.';
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
      if (producto) {
        // Actualizar producto existente
        await axiosInstance.put('https://localhost:7249/api/Ventas/updProducto', { productoId: producto.productoId, ...formData });
      } else {
        // Insertar nuevo producto
        await axiosInstance.post('https://localhost:7249/api/Ventas/InsertarProducto', formData);
      }
      onSubmit(); // Llamar a la función onSubmit pasada como prop
    } catch (error) {
      console.error('Error al insertar o actualizar el producto:', error);
    } finally {
      setIsDisabled(false);
    }
  };

  const handleClear = () => {
    setFormData({
      nombreProducto: '',
      descripcion: '',
    });
    setErrors({});
  };

  return (
    <div className="flex items-start space-x-6 p-6 bg-yellow-50 shadow-lg rounded-lg mb-4" style={{ backgroundColor: '#F5F5DC' }}>
      <form onSubmit={handleSubmit} className="space-y-6 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-green-900">Nombre del Producto</label>
            <input
              type="text"
              name="nombreProducto"
              value={formData.nombreProducto}
              onChange={handleChange}
              disabled={isDisabled}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
              placeholder="Ingrese el nombre del producto"
            />
            {errors.nombreProducto && <p className="text-red-600 text-xs mt-2">{errors.nombreProducto}</p>}
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-green-900">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              disabled={isDisabled}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
              placeholder="Ingrese la descripción"
              rows="3"
            />
            {errors.descripcion && <p className="text-red-600 text-xs mt-2">{errors.descripcion}</p>}
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
          {producto ? 'Actualizar Producto' : 'Insertar Producto'}
        </button>
      </div>
    </div>
  );
};

export default ProductoForm;
