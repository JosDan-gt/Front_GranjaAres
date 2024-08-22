import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProduccionGrafica from '../components/Dashboard/produccionGrafica';

const Dashboard = () => {
  const [lotes, setLotes] = useState([]);
  const [datosLote, setDatosLote] = useState(null);
  const [loteActual, setLoteActual] = useState(null);
  const [produccionDiaria, setProduccionDiaria] = useState([]);
  const [produccionSemanal, setProduccionSemanal] = useState([]);
  const [produccionMensual, setProduccionMensual] = useState([]);
  const [loading, setLoading] = useState(true);  // Añadido para gestionar el estado de carga

  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const response = await axios.get('https://localhost:7249/getlotes');
        setLotes(response.data);

        if (response.data.length > 0) {
          setLoteActual(response.data[0].idLote);
        }
      } catch (error) {
        console.error('Error fetching lotes:', error);
      } finally {
        setLoading(false);  // Finaliza el estado de carga
      }
    };

    fetchLotes();
  }, []);

  useEffect(() => {
    if (loteActual !== null) {
      const fetchLoteData = async () => {
        try {
          const response = await axios.get(`https://localhost:7249/api/dashboard/infolote/${loteActual}`);
          setDatosLote(response.data);
        } catch (error) {
          console.error('Error fetching lote data:', error);
        }
      };

      fetchLoteData();
    }
  }, [loteActual]);

  useEffect(() => {
    if (loteActual !== null) {
      const fetchProduccion = async (periodo) => {
        try {
          const response = await axios.get(`https://localhost:7249/api/dashboard/produccion/${loteActual}/${periodo}`);
          switch (periodo) {
            case 'diario':
              setProduccionDiaria(response.data);
              break;
            case 'semanal':
              setProduccionSemanal(response.data);
              break;
            case 'mensual':
              setProduccionMensual(response.data);
              break;
            default:
              break;
          }
        } catch (error) {
          console.error(`Error fetching producción ${periodo}:`, error);
        }
      };

      fetchProduccion('diario');
      fetchProduccion('semanal');
      fetchProduccion('mensual');
    }
  }, [loteActual]);

  if (loading) return <div className="text-center text-gray-500 mt-20">Cargando lotes...</div>;

  if (!lotes.length) {
    return (
      <div className="flex items-center justify-center h-full text-center">
        <div>
          <h2 className="text-xl font-bold text-gray-600">No hay lotes disponibles</h2>
          <p className="text-gray-500">Agrega un nuevo lote para comenzar a ver los datos.</p>
        </div>
      </div>
    );
  }

  if (!datosLote) return <div className="text-center text-gray-500 mt-20">Cargando datos del lote...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Lote Actual: {loteActual}</h2>
      <div className="mb-4">
        <label htmlFor="lote-select" className="block text-lg font-semibold mb-2">Selecciona un Lote:</label>
        <select
          id="lote-select"
          className="bg-white border border-gray-300 p-2 rounded"
          value={loteActual}
          onChange={(e) => setLoteActual(parseInt(e.target.value))}
        >
          {lotes.map((lote) => (
            <option key={lote.idLote} value={lote.idLote}>
              {lote.numLote}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
        <h3 className="text-2xl font-semibold text-gray-700 mb-6">Detalles del Lote</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
            <h4 className="font-semibold text-gray-600 mb-2">Producción Total</h4>
            <p className="text-gray-800">{datosLote.produccionTotal || 0} huevos</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
            <h4 className="font-semibold text-gray-600 mb-2">Cantidad de Gallinas</h4>
            <p className="text-gray-800">{datosLote.cantidadGallinas || 'No disponible'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
            <h4 className="font-semibold text-gray-600 mb-2">Cantidad de Gallinas Actual</h4>
            <p className="text-gray-800">{datosLote.cantidadGallinasActual || 'No disponible'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
            <h4 className="font-semibold text-gray-600 mb-2">Bajas</h4>
            <p className="text-gray-800">{datosLote.bajas != null ? datosLote.bajas : 'No disponible'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md shadow-sm">
            <h4 className="font-semibold text-gray-600 mb-2">Raza</h4>
            <p className="text-gray-800">{datosLote.raza || 'No disponible'}</p>
          </div>
        </div>
      </div>

      <ProduccionGrafica
        produccionDiaria={produccionDiaria}
        produccionSemanal={produccionSemanal}
        produccionMensual={produccionMensual}
      />
    </div>
  );
};

export default Dashboard;
