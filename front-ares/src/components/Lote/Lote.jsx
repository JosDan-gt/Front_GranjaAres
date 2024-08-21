// src/components/Lote/Lote.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Lote = () => {
  const [lotes, setLotes] = useState([]);
  const [razas, setRazas] = useState([]);
  const [corrales, setCorrales] = useState([]);
  const [newLote, setNewLote] = useState({
    numLote: '',
    cantidadG: '',
    idRaza: '',
    fechaAdq: '',
    idCorral: '',
  });
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const response = await axios.get('https://localhost:7249/getlotes');
        setLotes(response.data);
      } catch (error) {
        console.error('Error al obtener lotes:', error);
      }
    };

    const fetchRazas = async () => {
      try {
        const response = await axios.get('https://localhost:7249/getrazaG');
        setRazas(response.data);
      } catch (error) {
        console.error('Error al obtener razas:', error);
      }
    };

    const fetchCorrales = async () => {
      try {
        const response = await axios.get('https://localhost:7249/getcorral');
        const allCorrales = response.data;

        // Filtrar corrales que ya están en uso
        const corralesEnUso = lotes.map(lote => lote.idCorral);
        const corralesDisponibles = allCorrales.filter(
          corral => !corralesEnUso.includes(corral.idCorral)
        );

        setCorrales(corralesDisponibles);
      } catch (error) {
        console.error('Error al obtener corrales:', error);
      }
    };

    fetchLotes();
    fetchRazas();
    fetchCorrales();
  }, [lotes]);

  const handleSelectionChange = (idLote, value) => {
    if (value === 'produccion') {
      navigate(`/produccion/${idLote}`);
    } else if (value === 'clasificacion') {
      navigate(`/clasificacion/${idLote}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLote((prevLote) => ({
      ...prevLote,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const regexLetters = /^[a-zA-Z\s]*$/;

    if (!newLote.numLote) {
      newErrors.numLote = 'Este campo es obligatorio.';
    } else if (!regexLetters.test(newLote.numLote)) {
      newErrors.numLote = 'El campo solo debe contener letras.';
    } else if (lotes.some(lote => lote.numLote === newLote.numLote)) {
      newErrors.numLote = 'El número de lote ya existe. Elija otro.';
    }

    if (newLote.cantidadG === '' || parseInt(newLote.cantidadG) <= 0) {
      newErrors.cantidadG = 'El campo debe ser un número positivo.';
    }

    if (!newLote.idRaza) {
      newErrors.idRaza = 'Este campo es obligatorio.';
    }

    if (!newLote.fechaAdq) {
      newErrors.fechaAdq = 'Este campo es obligatorio.';
    }

    if (!newLote.idCorral) {
      newErrors.idCorral = 'Este campo es obligatorio.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      await axios.post('https://localhost:7249/postLote', newLote);
      alert('Lote creado exitosamente');
      setNewLote({
        numLote: '',
        cantidadG: '',
        idRaza: '',
        fechaAdq: '',
        idCorral: '',
      });
      setShowForm(false);
      navigate(0); // Recargar la página para cargar el nuevo lote
    } catch (error) {
      console.error('Error al crear lote:', error);
      alert('Error al crear el lote');
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Lotes</h2>

      {/* Botón para mostrar/ocultar el formulario */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
      >
        {showForm ? 'Ocultar Formulario' : 'Agregar Nuevo Lote'}
      </button>

      {/* Formulario para agregar un nuevo Lote */}
      {showForm && (
        <div className="mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium">Número de Lote</label>
                <input
                  type="text"
                  name="numLote"
                  value={newLote.numLote}
                  onChange={handleChange}
                  className="w-full px-2 py-1 border rounded"
                  required
                />
                {errors.numLote && <p className="text-red-500 text-xs mt-1">{errors.numLote}</p>}
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium">Cantidad de Gallinas</label>
                <input
                  type="number"
                  name="cantidadG"
                  value={newLote.cantidadG}
                  onChange={handleChange}
                  className="w-full px-2 py-1 border rounded"
                  required
                />
                {errors.cantidadG && <p className="text-red-500 text-xs mt-1">{errors.cantidadG}</p>}
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium">Raza</label>
                <select
                  name="idRaza"
                  value={newLote.idRaza}
                  onChange={handleChange}
                  className="w-full px-2 py-1 border rounded"
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
                <label className="block text-sm font-medium">Fecha de Adquisición</label>
                <input
                  type="date"
                  name="fechaAdq"
                  value={newLote.fechaAdq}
                  onChange={handleChange}
                  className="w-full px-2 py-1 border rounded"
                  required
                />
                {errors.fechaAdq && <p className="text-red-500 text-xs mt-1">{errors.fechaAdq}</p>}
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium">Corral</label>
                <select
                  name="idCorral"
                  value={newLote.idCorral}
                  onChange={handleChange}
                  className="w-full px-2 py-1 border rounded"
                  required
                >
                  <option value="" disabled>Seleccione un corral</option>
                  {corrales.map((corral) => (
                    <option key={corral.idCorral} value={corral.idCorral}>
                      {corral.numCorral}
                    </option>
                  ))}
                </select>
                {errors.idCorral && <p className="text-red-500 text-xs mt-1">{errors.idCorral}</p>}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                Crear Lote
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Listado de Lotes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lotes.map((lote) => (
          <div key={lote.idLote} className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-2">Lote {lote.numLote}</h3>
            <p>Cantidad: {lote.cantidadG}</p>
            <p>Fecha de Adquisición: {new Date(lote.fechaAdq).toLocaleDateString()}</p>
            <div className="mt-4">
              <select
                onChange={(e) => handleSelectionChange(lote.idLote, e.target.value)}
                className="px-2 py-1 border rounded"
                defaultValue=""
              >
                <option value="" disabled>Selecciona una opción</option>
                <option value="produccion">Producción</option>
                <option value="clasificacion">Clasificación</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lote;
