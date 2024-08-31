import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance'; // Importa la instancia de axios configurada

const LoteForm = ({ loteData, razas, lotes, isEditing, onCancel, onSubmit, idLote }) => {
  const [formData, setFormData] = useState({
    idLote: '',
    numLote: '',
    cantidadG: '',
    idRaza: '',
    fechaAdq: '',
    idCorral: '',
  });
  const [corrales, setCorrales] = useState([]); // Almacena los corrales aquí
  const [errors, setErrors] = useState({});
  const [estadoLoteExists, setEstadoLoteExists] = useState(false);

  useEffect(() => {
    console.log('idLote:', idLote); // Verifica si idLote tiene un valor

    setFormData(loteData || {
      idLote: '',
      numLote: '',
      cantidadG: '',
      idRaza: '',
      fechaAdq: '',
      idCorral: '',
    });

    const fetchCorrales = async () => {
      try {
        const response = await axiosInstance.get('/getcorral');
        const corralesHabilitados = response.data.filter(corral => corral.estado === true); // Filtra por estado habilitado (true)
        setCorrales(corralesHabilitados);
        console.log('Corrales habilitados:', corralesHabilitados); // Verifica que se están cargando los corrales habilitados
      } catch (error) {
        console.error('Error al obtener corrales:', error);
      }
    };

    const fetchEstadoLote = async () => {
      if (idLote) {
        try {
          const response = await axiosInstance.get(`/getestadolote?idLote=${idLote}`);

          if (response.data && response.data.length > 0) {
            setEstadoLoteExists(true); // Si existe un registro, establecemos el estado a true
          } else {
            setEstadoLoteExists(false);
          }
        } catch (error) {
          console.error('Error fetching EstadoLote:', error);
        }
      } else {
        console.log('idLote no está definido.');
      }
    };

    fetchCorrales();
    fetchEstadoLote();
  }, [loteData, idLote]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClear = () => {
    setFormData({
      numLote: '',
      cantidadG: '',
      idRaza: '',
      fechaAdq: '',
      idCorral: '',
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    const regexLetters = /^[a-zA-Z\s]*$/;

    if (!formData.numLote) {
      newErrors.numLote = 'Este campo es obligatorio.';
    } else if (!regexLetters.test(formData.numLote)) {
      newErrors.numLote = 'El campo solo debe contener letras.';
    }

    if (formData.cantidadG === '' || parseInt(formData.cantidadG) <= 0) {
      newErrors.cantidadG = 'El campo debe ser un número positivo.';
    }

    if (!formData.idRaza) {
      newErrors.idRaza = 'Este campo es obligatorio.';
    }

    if (!formData.fechaAdq) {
      newErrors.fechaAdq = 'Este campo es obligatorio.';
    }

    if (!formData.idCorral) {
      newErrors.idCorral = 'Este campo es obligatorio.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const isCorralInUse = (corralId) => {
    return lotes.some(lote => lote.idCorral === corralId);
  };

  return (
    <div className="mb-6 bg-white p-6 shadow-lg rounded-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        {isEditing ? 'Actualizar Lote' : 'Crear Nuevo Lote'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Número de Lote</label>
            <input
              type="text"
              name="numLote"
              value={formData.numLote}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {errors.numLote && <p className="text-red-500 text-xs mt-1">{errors.numLote}</p>}
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Cantidad de Gallinas</label>
            <input
              type="number"
              name="cantidadG"
              value={formData.cantidadG}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={estadoLoteExists} // Disable if there's an EstadoLote record
            />
            {errors.cantidadG && <p className="text-red-500 text-xs mt-1">{errors.cantidadG}</p>}
            {estadoLoteExists && (
              <p className="text-yellow-500 text-xs mt-1">Ya existe un registro con esta cantidad de gallinas. No se puede modificar.</p>
            )}
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Raza</label>
            <select
              name="idRaza"
              value={formData.idRaza}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="" disabled>Seleccione una raza</option>
              {razas.map((raza) => (
                <option key={raza.idRaza} value={raza.idRaza}>
                  {raza.raza}
                </option>
              ))}
            </select>
            {errors.idRaza && <p className="text-red-500 text-xs mt-1">{errors.idRaza}</p>}
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de Adquisición</label>
            <input
              type="date"
              name="fechaAdq"
              value={formData.fechaAdq}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {errors.fechaAdq && <p className="text-red-500 text-xs mt-1">{errors.fechaAdq}</p>}
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Corral</label>
            <select
              name="idCorral"
              value={formData.idCorral}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="" disabled>Seleccione un corral</option>
              {corrales
                .map((corral) => (
                  <option
                    key={corral.idCorral}
                    value={corral.idCorral}
                    disabled={isCorralInUse(corral.idCorral) && corral.idCorral !== formData.idCorral}
                  >
                    {corral.numCorral} {isCorralInUse(corral.idCorral) ? '(En uso)' : ''}
                  </option>
                ))}
            </select>
            {errors.idCorral && <p className="text-red-500 text-xs mt-1">{errors.idCorral}</p>}
          </div>
        </div>
        <div className="flex justify-start mt-6 space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
          >
            Limpiar
          </button>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
            {isEditing ? 'Actualizar Lote' : 'Crear Lote'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoteForm;
