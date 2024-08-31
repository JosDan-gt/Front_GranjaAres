import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';

const LoteSelector = ({ onSelectLote }) => {
  const [lotes, setLotes] = useState([]);
  const [selectedLote, setSelectedLote] = useState('');

  useEffect(() => {
    axiosInstance.get('/getlotes')
      .then(response => {
        setLotes(response.data);
        if (response.data.length > 0) {
          const firstLote = response.data[0].idLote;
          setSelectedLote(firstLote); // Establece el primer lote en el estado
          onSelectLote(firstLote); // Selecciona el primer lote automáticamente
        }
      })
      .catch(error => console.error('Error fetching lotes:', error));
  }, [onSelectLote]);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedLote(selectedValue);
    onSelectLote(selectedValue);
  };

  return (
    <div className="mb-4 flex justify-center">
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
              {lote.numLote} (Cantidad Actual: {lote.cantidadGctual})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LoteSelector;
