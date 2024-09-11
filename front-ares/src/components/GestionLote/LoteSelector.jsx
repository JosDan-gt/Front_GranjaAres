import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';

const LoteSelector = ({ onSelectLote }) => {
  const [lotes, setLotes] = useState([]);
  const [selectedLote, setSelectedLote] = useState('');
  const [dadosDeBaja, setDadosDeBaja] = useState(false); // Para manejar el estado de lotes dados de baja o no

  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const response = await axiosInstance.get(`/api/lotes?dadosDeBaja=${dadosDeBaja}`);
        setLotes(response.data);
        if (response.data.length > 0) {
          const firstLote = response.data[0].idLote;
          setSelectedLote(firstLote); // Establece el primer lote en el estado
          onSelectLote(firstLote); // Selecciona el primer lote automáticamente
        }
      } catch (error) {
        console.error('Error fetching lotes:', error);
      }
    };

    fetchLotes();
  }, [dadosDeBaja, onSelectLote]);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedLote(selectedValue);
    onSelectLote(selectedValue);
  };

  const toggleLotes = () => {
    setDadosDeBaja(prevState => !prevState); // Cambia entre lotes activos y dados de baja
  };

  return (
    <div className="mb-4 flex flex-col items-center">
      <div className="w-64">
        <label htmlFor="loteSelect" className="block text-2xl font-bold text-green-800 text-center">Selecciona un Lote</label>
        <select 
          id="loteSelect" 
          value={selectedLote}
          onChange={handleSelectChange} 
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-yellow-600 bg-yellow-100 text-yellow-800 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm rounded-md"
        >
          <option value="">Seleccione un lote...</option>
          {lotes.map(lote => (
            <option key={lote.idLote} value={lote.idLote}>
              {lote.numLote} (Cantidad Actual: {lote.cantidadActual})
            </option>
          ))}
        </select>
      </div>
      <button 
        onClick={toggleLotes} 
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        {dadosDeBaja ? 'Mostrar Activos' : 'Mostrar Dados de Baja'}
      </button>
    </div>
  );
};

export default LoteSelector;
