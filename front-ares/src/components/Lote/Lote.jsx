import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
    const fetchLotes = async () => {
      try {
        const response = await axios.get('https://localhost:7249/getlotes');
        if (response.status === 200 && response.data.length > 0) {
          console.log('Lotes cargados:', response.data);
          setLotes(response.data);
        } else {
          console.log('No se encontraron lotes activos.');
          setLotes([]); // Asigna un array vacío si no hay lotes activos
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log('No se encontraron lotes activos.');
          setLotes([]); // Asigna un array vacío en caso de error 404
        } else {
          console.error('Error al obtener lotes:', error);
        }
      }
    };

    const fetchLotesDadosDeBaja = async () => {
      try {
        const response = await axios.get('https://localhost:7249/getlotesdadosdebaja');
        setLotesDadosDeBaja(response.data);
      } catch (error) {
        console.error('Error al obtener lotes dados de baja:', error);
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
        setCorrales(response.data);
      } catch (error) {
        console.error('Error al obtener corrales:', error);
      }
    };

    const fetchData = async () => {
      await fetchLotes();
      await fetchLotesDadosDeBaja();
      await fetchRazas();
      await fetchCorrales();
      setIsLoading(false); // Indica que la carga ha terminado
    };

    fetchData();
  }, []);

  const handleSelectionChange = (idLote, value) => {
    const selectedLote = lotes.find(lote => lote.idLote === idLote) || lotesDadosDeBaja.find(lote => lote.idLote === idLote);

    if (!selectedLote) {
      console.error(`Lote con id ${idLote} no encontrado`);
      alert('Lote no encontrado. Por favor, selecciona un lote válido.');
      return;
    }

    if (value === 'produccion') {
      navigate(`/produccion/${idLote}`, { state: { estadoBaja: selectedLote.estadoBaja } });
    } else if (value === 'clasificacion') {
      navigate(`/clasificacion/${idLote}`, { state: { estadoBaja: selectedLote.estadoBaja } });
    } else if (value === 'estado') {
      navigate(`/estado/${idLote}`, { state: { estadoBaja: selectedLote.estadoBaja } });
    }
  };


  const handleAddNew = () => {
    setSelectedLote(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (lote) => {
    const formattedDate = lote.fechaAdq ? lote.fechaAdq.split('T')[0] : '';
    setSelectedLote({
      ...lote,
      fechaAdq: formattedDate,
      idLote: lote.idLote
    });

    setIsEditing(true);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedLote(null);
    setIsEditing(false);
  };

  const handleDelete = async (idLote) => {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este lote?");
    if (confirmed) {
      try {
        await axios.put(`https://localhost:7249/updateestadolot?idlote=${idLote}`, { Estado: false });
        alert('Lote eliminado correctamente');
        setLotes(lotes.filter(lote => lote.idLote !== idLote)); // Remover el lote eliminado de la lista
      } catch (error) {
        console.error('Error al eliminar el lote:', error.response?.data || error.message);
        alert('Error al eliminar el lote');
      }
    }
  };

  const handleDarDeBaja = async (idLote) => {
    const confirmed = window.confirm("¿Estás seguro de que deseas dar de baja este lote?");
    if (confirmed) {
      try {
        // Asegúrate de que el cuerpo se envía correctamente como JSON
        const response = await axios.put(
          `https://localhost:7249/api/lotes/putLoteBaja?idLote=${idLote}`,
          { estadoBaja: true }, // Aquí se envía el JSON correcto
          { headers: { 'Content-Type': 'application/json' } } // Especifica el tipo de contenido
        );
        alert('Lote dado de baja correctamente');

        // Actualizar el estado en el frontend
        const lote = lotes.find(lote => lote.idLote === idLote);
        setLotesDadosDeBaja([...lotesDadosDeBaja, { ...lote, estadoBaja: true }]);
        setLotes(lotes.filter(lote => lote.idLote !== idLote));
      } catch (error) {
        console.error('Error al dar de baja el lote:', error.response?.data || error.message);
        alert('Error al dar de baja el lote');
      }
    }
  };

  const handleDarDeAlta = async (idLote) => {
    const confirmed = window.confirm("¿Estás seguro de que deseas dar de alta este lote?");
    if (confirmed) {
      try {
        // Nota: El idLote lo estás enviando como parámetro de la URL, lo cual está bien,
        // pero también necesitas asegurarte de que el cuerpo de la solicitud JSON esté correctamente formateado.
        const response = await axios.put(`https://localhost:7249/api/lotes/putLoteBaja?idLote=${idLote}`, { estadoBaja: false });
        alert('Lote dado de alta correctamente');

        // Actualizar el estado en el frontend
        const lote = lotesDadosDeBaja.find(lote => lote.idLote === idLote);
        setLotes([...lotes, { ...lote, estadoBaja: false }]);
        setLotesDadosDeBaja(lotesDadosDeBaja.filter(lote => lote.idLote !== idLote));
      } catch (error) {
        console.error('Error al dar de alta el lote:', error.response?.data || error.message);
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
        payload.idLote = parseInt(formData.idLote, 10);
        await axios.put('https://localhost:7249/putLote', payload);
        alert('Lote actualizado exitosamente');
      } else {
        await axios.post('https://localhost:7249/postLote', payload);
        alert('Lote creado exitosamente');
      }

      handleFormClose();
      navigate(0);
    } catch (error) {
      if (error.response && error.response.data) {
        alert(`Error al registrar clasificación: ${error.response.data.message || 'Error desconocido.'}`);
      } else {
        alert('Error al registrar clasificación.');
      }
      console.error('Error al registrar clasificación:', error);
    }
  };

  if (isLoading) {
    return <p>Cargando datos, por favor espera...</p>;
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Lotes</h2>

      {lotes.length === 0 ? (
        <p>No hay lotes activos disponibles en este momento.</p>
      ) : (
        <>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-4 py-2 bg-blue-500 text-white rounded mb-4`}
          >
            {showForm ? 'Ocultar Formulario' : 'Agregar Nuevo Lote'}
          </button>

          {/* Resto de la lógica para mostrar los lotes */}
        </>
      )}

      {showForm && (
        <LoteForm
          loteData={selectedLote}
          razas={razas}
          corrales={corrales}
          lotes={lotes}
          isEditing={isEditing}
          onCancel={handleFormClose}
          onSubmit={handleSubmit}
          idLote={selectedLote?.idLote}
          isDisabled={selectedLote?.estadoBaja}
        />
      )}

      <h3 className="text-2xl font-bold text-gray-700 mb-4">Lotes Activos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lotes.map((lote) => (
          <div
            key={lote.idLote}
            className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-700 mb-4"> {lote.numLote}</h3>

            <div className="mb-4">
              <p className="text-gray-600">
                <span className="font-medium text-gray-800">Cantidad:</span> {lote.cantidadG}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-800">Fecha de Adquisición:</span> {new Date(lote.fechaAdq).toLocaleDateString()}
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor={`select-${lote.idLote}`} className="block text-sm font-medium text-gray-700 mb-2">
                Acciones
              </label>
              <select
                id={`select-${lote.idLote}`}
                onChange={(e) => handleSelectionChange(lote.idLote, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                defaultValue=""
              >
                <option value="" disabled>Selecciona una opción</option>
                <option value="produccion">Producción</option>
                <option value="clasificacion">Clasificación</option>
                <option value="estado">Estado</option>
              </select>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => handleEdit(lote)}
                className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition duration-300"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(lote.idLote)}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300"
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

      <h3 className="text-2xl font-bold text-gray-700 mt-10 mb-4">Lotes Dados de Baja</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lotesDadosDeBaja.map((lote) => (
          <div
            key={lote.idLote}
            className="border border-gray-300 rounded-lg p-6 bg-red-300 bg-opacity-50 shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-700 mb-4"> {lote.numLote}</h3>

            <div className="mb-4">
              <p className="text-gray-600">
                <span className="font-medium text-gray-800">Cantidad:</span> {lote.cantidadG}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-800">Fecha de Adquisición:</span> {new Date(lote.fechaAdq).toLocaleDateString()}
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor={`select-${lote.idLote}`} className="block text-sm font-medium text-gray-700 mb-2">
                Acciones
              </label>
              <select
                id={`select-${lote.idLote}`}
                onChange={(e) => handleSelectionChange(lote.idLote, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                defaultValue=""
              >
                <option value="" disabled>Selecciona una opción</option>
                <option value="produccion">Producción</option>
                <option value="clasificacion">Clasificación</option>
                <option value="estado">Estado</option>
              </select>
            </div>

            <div className="flex justify-between">
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
