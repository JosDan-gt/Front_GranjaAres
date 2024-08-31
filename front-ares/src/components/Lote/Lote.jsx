import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance'; 
import { useNavigate } from 'react-router-dom';
import LoteForm from './LoteForm';

const Lote = () => {
  const [lotes, setLotes] = useState([]);
  const [lotesDadosDeBaja, setLotesDadosDeBaja] = useState([]);
  const [razas, setRazas] = useState([]);
  const [corrales, setCorrales] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLote, setSelectedLote] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseLotes = await axiosInstance.get('/getlotes');
        setLotes(responseLotes.data || []);

        const responseLotesBaja = await axiosInstance.get('/getlotesdadosdebaja');
        setLotesDadosDeBaja(responseLotesBaja.data || []);

        const responseRazas = await axiosInstance.get('/getrazaG');
        setRazas(responseRazas.data || []);

        const responseCorrales = await axiosInstance.get('/getcorral');
        setCorrales(responseCorrales.data || []);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectionChange = (idLote, value) => {
    const selectedLote = lotes.find(lote => lote.idLote === idLote) || lotesDadosDeBaja.find(lote => lote.idLote === idLote);

    if (!selectedLote) {
      alert('Lote no encontrado. Por favor, selecciona un lote válido.');
      return;
    }

    navigate(`/${value}/${idLote}`, { state: { estadoBaja: selectedLote.estadoBaja } });
  };

  const handleAddNew = () => {
    setSelectedLote(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (lote) => {
    setSelectedLote({ ...lote, fechaAdq: lote.fechaAdq.split('T')[0] });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedLote(null);
    setIsEditing(false);
  };

  const handleDelete = async (idLote) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este lote?")) {
      try {
        await axiosInstance.put(`/updateestadolot?idlote=${idLote}`, { Estado: false });
        setLotes(lotes.filter(lote => lote.idLote !== idLote));
        alert('Lote eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar el lote:', error);
        alert('Error al eliminar el lote');
      }
    }
  };

  const handleDarDeBaja = async (idLote) => {
    if (window.confirm("¿Estás seguro de que deseas dar de baja este lote?")) {
      try {
        await axiosInstance.put(`/api/lotes/putLoteBaja?idLote=${idLote}`, { estadoBaja: true });
        const lote = lotes.find(lote => lote.idLote === idLote);
        setLotesDadosDeBaja([...lotesDadosDeBaja, { ...lote, estadoBaja: true }]);
        setLotes(lotes.filter(lote => lote.idLote !== idLote));
        alert('Lote dado de baja correctamente');
      } catch (error) {
        console.error('Error al dar de baja el lote:', error);
        alert('Error al dar de baja el lote');
      }
    }
  };

  const handleDarDeAlta = async (idLote) => {
    if (window.confirm("¿Estás seguro de que deseas dar de alta este lote?")) {
      try {
        await axiosInstance.put(`/api/lotes/putLoteBaja?idLote=${idLote}`, { estadoBaja: false });
        const lote = lotesDadosDeBaja.find(lote => lote.idLote === idLote);
        setLotes([...lotes, { ...lote, estadoBaja: false }]);
        setLotesDadosDeBaja(lotesDadosDeBaja.filter(lote => lote.idLote !== idLote));
        alert('Lote dado de alta correctamente');
      } catch (error) {
        console.error('Error al dar de alta el lote:', error);
        alert('Error al dar de alta el lote');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const payload = {
        numLote: formData.numLote,
        cantidadG: parseInt(formData.cantidadG, 10),
        idRaza: parseInt(formData.idRaza, 10),
        fechaAdq: formData.fechaAdq,
        idCorral: parseInt(formData.idCorral, 10)
      };

      if (isEditing && formData.idLote) {
        await axiosInstance.put('/putLote', { ...payload, idLote: parseInt(formData.idLote, 10) });
        alert('Lote actualizado exitosamente');
      } else {
        await axiosInstance.post('/postLote', payload);
        alert('Lote creado exitosamente');
      }

      handleFormClose();
      navigate(0);
    } catch (error) {
      alert('Error al registrar clasificación.');
      console.error('Error al registrar clasificación:', error);
    }
  };

  if (isLoading) {
    return <p>Cargando datos, por favor espera...</p>;
  }

  return (
    <div className="p-4 sm:p-6 bg-yellow-50 shadow-lg rounded-lg">
      <h2 className="text-2xl sm:text-3xl font-bold text-green-900 mb-4 sm:mb-6">Lotes de la Granja</h2>
  
      <button
        onClick={handleAddNew}
        className="px-4 py-2 mb-4 bg-green-700 text-white rounded hover:bg-green-800 transition duration-300"
      >
        {showForm ? 'Ocultar Formulario' : 'Agregar Nuevo Lote'}
      </button>
  
      {showForm && (
        <LoteForm
          loteData={selectedLote}
          razas={razas}
          corrales={corrales}
          lotes={lotes}
          isEditing={isEditing}
          onCancel={handleFormClose}
          onSubmit={handleSubmit}
        />
      )}
  
      <h3 className="text-xl sm:text-2xl font-bold text-green-700 mb-4">Lotes Activos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {lotes.map((lote) => (
          <div key={lote.idLote} className="border border-green-300 rounded-lg p-4 sm:p-6 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg sm:text-xl font-semibold text-green-900 mb-2 sm:mb-4">Lote {lote.numLote}</h3>
  
            <p className="text-green-700"><span className="font-medium text-green-900">Cantidad:</span> {lote.cantidadG}</p>
            <p className="text-green-700"><span className="font-medium text-green-900">Fecha de Adquisición:</span> {new Date(lote.fechaAdq).toLocaleDateString()}</p>
  
            <label htmlFor={`select-${lote.idLote}`} className="block text-sm font-medium text-green-900 mt-2 sm:mt-4 mb-2">
              Acciones
            </label>
            <select
              id={`select-${lote.idLote}`}
              onChange={(e) => handleSelectionChange(lote.idLote, e.target.value)}
              className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-900"
              defaultValue=""
            >
              <option value="" disabled>Selecciona una opción</option>
              <option value="produccionG">Producción</option>
              <option value="clasificacion">Clasificación</option>
              <option value="estado">Estado</option>
            </select>
  
            <div className="flex flex-col sm:flex-row justify-between mt-2 sm:mt-4">
              <button
                onClick={() => handleEdit(lote)}
                className="px-4 py-2 mb-2 sm:mb-0 sm:mr-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition duration-300"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(lote.idLote)}
                className="px-4 py-2 mb-2 sm:mb-0 sm:mr-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300"
              >
                Eliminar
              </button>
              <button
                onClick={() => handleDarDeBaja(lote.idLote)}
                className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
              >
                Dar de Baja
              </button>
            </div>
          </div>
        ))}
      </div>
  
      <h3 className="text-xl sm:text-2xl font-bold text-green-700 mt-8 mb-4">Lotes Dados de Baja</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {lotesDadosDeBaja.map((lote) => (
          <div key={lote.idLote} className="border border-red-400 rounded-lg p-4 sm:p-6 bg-red-200 bg-opacity-50 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg sm:text-xl font-semibold text-green-900 mb-2 sm:mb-4">Lote {lote.numLote}</h3>
  
            <p className="text-green-700"><span className="font-medium text-green-900">Cantidad:</span> {lote.cantidadG}</p>
            <p className="text-green-700"><span className="font-medium text-green-900">Fecha de Adquisición:</span> {new Date(lote.fechaAdq).toLocaleDateString()}</p>
  
            <label htmlFor={`select-${lote.idLote}`} className="block text-sm font-medium text-green-900 mt-2 sm:mt-4 mb-2">
              Acciones
            </label>
            <select
              id={`select-${lote.idLote}`}
              onChange={(e) => handleSelectionChange(lote.idLote, e.target.value)}
              className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-900"
              defaultValue=""
            >
              <option value="" disabled>Selecciona una opción</option>
              <option value="produccionG">Producción</option>

              <option value="clasificacion">Clasificación</option>
              <option value="estado">Estado</option>
            </select>
  
            <div className="flex justify-between mt-2 sm:mt-4">
              <button
                onClick={() => handleDarDeAlta(lote.idLote)}
                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
              >
                Dar de Alta
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lote;
