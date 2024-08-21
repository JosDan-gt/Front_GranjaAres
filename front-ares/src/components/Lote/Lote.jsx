// src/components/Lote/Lote.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Lote = () => {
  const [lotes, setLotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const response = await axios.get('https://localhost:7249/getlotes');
        setLotes(response.data);
      } catch (error) {
        console.error('Error fetching lotes:', error);
      }
    };

    fetchLotes();
  }, []);

  const handleSelectionChange = (idLote, value) => {
    if (value === 'produccion') {
      navigate(`/produccion/${idLote}`);
    } else if (value === 'clasificacion') {
      navigate(`/clasificacion/${idLote}`);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Lotes</h2>
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
