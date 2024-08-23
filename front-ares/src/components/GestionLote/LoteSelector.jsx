import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LoteSelector = ({ onSelectLote }) => {
  const [lotes, setLotes] = useState([]);

  useEffect(() => {
    axios.get('https://localhost:7249/getlotes')
      .then(response => setLotes(response.data))
      .catch(error => console.error('Error fetching lotes:', error));
  }, []);

  const handleSelectChange = (event) => {
    onSelectLote(event.target.value);
  };

  return (
    <div className="mb-4">
      <label htmlFor="loteSelect" className="block text-sm font-medium text-gray-700">Selecciona un Lote</label>
      <select 
        id="loteSelect" 
        onChange={handleSelectChange} 
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value="">Seleccione un lote...</option>
        {lotes.map(lote => (
          <option key={lote.idLote} value={lote.idLote}>
            {lote.numLote} (Cantidad Actual: {lote.cantidadGctual})
          </option>
        ))}
      </select>
    </div>
  );
};

export default LoteSelector;
