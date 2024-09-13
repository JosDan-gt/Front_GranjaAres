import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../components/axiosInstance';
import ProduccionGrafica from '../components/Dashboard/produccionGrafica.jsx';
import ClasificacionGrafica from '../components/Dashboard/clasificacionGrafica.jsx';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { AuthContext } from '../components/Context/AuthContext.jsx';

const Dashboard = () => {
  const [lotes, setLotes] = useState([]);
  const [datosLote, setDatosLote] = useState(null);
  const [loteActual, setLoteActual] = useState(null);
  const [period, setPeriod] = useState('diario');
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  // Verificar autenticación al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('token') || Cookies.get('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      navigate('/login', { replace: true });
    }
  }, [navigate, setIsAuthenticated]);

  // Cargar lotes cuando el componente se monta o cuando se cambia el estado de autenticación
  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const response = await axiosInstance.get('/api/lotes');
        setLotes(response.data);

        if (response.data.length > 0) {
          setLoteActual(response.data[0].idLote); // Selecciona el primer lote automáticamente
        }
      } catch (error) {
        console.error('Error fetching lotes:', error);
      }
    };

    fetchLotes();
  }, []);

  // Cargar los detalles del lote seleccionado
  useEffect(() => {
    if (loteActual !== null) {
      const fetchLoteData = async () => {
        try {
          const response = await axiosInstance.get(`/api/dashboard/infolote/${loteActual}`);
          setDatosLote(response.data);
        } catch (error) {
          console.error('Error fetching lote data:', error);
        }
      };

      fetchLoteData();
    }
  }, [loteActual]);

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

  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-green-900">Dashboard</h1>

        <div className="mb-4">
          <label htmlFor="lote-select" className="block text-2xl font-semibold mb-2 text-green-900">Selecciona un Lote:</label>
          <select
            id="lote-select"
            className="bg-white border border-green-300 p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            value={loteActual || ''}
            onChange={(e) => setLoteActual(parseInt(e.target.value))}
          >
            {lotes.map((lote) => (
              <option key={lote.idLote} value={lote.idLote}>
                {lote.numLote}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Detalles del Lote */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h4 className="font-semibold text-green-800 mb-2">Producción Total</h4>
          <p className="text-green-900">{datosLote?.produccionTotal || 0} huevos</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h4 className="font-semibold text-green-800 mb-2">Cantidad de Gallinas Inicial</h4>
          <p className="text-green-900">{datosLote?.cantidadGallinasActual || 'No disponible'}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h4 className="font-semibold text-green-800 mb-2">Cantidad de Gallinas Actual</h4>
          <p className="text-green-900">{datosLote?.cantidadGallinas || 'No disponible'}</p>
        </div>

      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h4 className="font-semibold text-green-800 mb-2">Bajas Totales</h4>
          <p className="text-green-900">{datosLote?.bajas != null ? datosLote.bajas : 'No disponible'}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h4 className="font-semibold text-green-800 mb-2">Raza</h4>
          <p className="text-green-900">{datosLote?.raza || 'No disponible'}</p>
        </div>
      </div>

      {/* Botones para seleccionar el periodo */}
      <div className="flex justify-center space-x-2 mb-6">
        <button
          onClick={() => setPeriod('diario')}
          className={`px-4 py-2 rounded-lg ${period === 'diario' ? 'bg-blue-700' : 'bg-blue-600'} text-white hover:bg-blue-700`}
        >
          Diario
        </button>
        <button
          onClick={() => setPeriod('semanal')}
          className={`px-4 py-2 rounded-lg ${period === 'semanal' ? 'bg-green-700' : 'bg-green-600'} text-white hover:bg-green-700`}
        >
          Semanal
        </button>
        <button
          onClick={() => setPeriod('mensual')}
          className={`px-4 py-2 rounded-lg ${period === 'mensual' ? 'bg-purple-700' : 'bg-purple-600'} text-white hover:bg-purple-700`}
        >
          Mensual
        </button>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <ProduccionGrafica idLote={loteActual} period={period} />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <ClasificacionGrafica idLote={loteActual} period={period} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
