import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../components/axiosInstance';
import ProduccionGrafica from '../components/Dashboard/produccionGrafica.jsx';
import ClasificacionGrafica from '../components/Dashboard/clasificacionGrafica.jsx';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { AuthContext } from '../components/Context/AuthContext.jsx';
import { FaEgg, FaUserAlt, FaChartBar, FaFeatherAlt, FaExclamationTriangle } from 'react-icons/fa'; // Íconos
import { GiChicken } from "react-icons/gi";
import { TbHexagonLetterR } from "react-icons/tb";

// Importa tu imagen de fondo
import back from '../components/Img/Back2.jpeg';  // Asegúrate de colocar la imagen en la carpeta correcta

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

  // Cargar lotes
  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const response = await axiosInstance.get('/api/lotes');
        setLotes(response.data);

        if (response.data.length > 0) {
          setLoteActual(response.data[0].idLote);
        }
      } catch (error) {
        console.error('Error fetching lotes:', error);
      }
    };

    fetchLotes();
  }, []);

  // Cargar detalles del lote seleccionado
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
          <h2 className="text-2xl font-bold text-gray-600">No hay lotes disponibles</h2>
          <p className="text-gray-500">Agrega un nuevo lote para comenzar a ver los datos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-cover bg-center">
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-6">Dashboard</h1>

        <div className="mb-6">
          <label htmlFor="lote-select" className="block text-2xl font-semibold mb-2 text-gray-800">
            Selecciona un Lote:
          </label>
          <select
            id="lote-select"
            className="bg-white border border-gray-300 p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-100 shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
            <FaEgg className="mr-2 text-gray-600" size={25} /> Producción Total
          </h4>
          <p className="text-gray-900 text-2xl font-bold">{datosLote?.produccionTotal || 0} huevos</p>
        </div>
        <div className="bg-violet-100 shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
            <FaFeatherAlt className="mr-2 text-gray-600" size={25} /> Cantidad de Gallinas Actual
          </h4>
          <p className="text-gray-900 text-2xl font-bold">{datosLote?.cantidadGallinasActual || 'No disponible'}</p>
        </div>
        <div className="bg-amber-100 shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
            <GiChicken className="mr-2 text-gray-600" size={30} /> Cantidad de Gallinas Inicial
          </h4>
          <p className="text-gray-900 text-2xl font-bold">{datosLote?.cantidadGallinas || 'No disponible'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-red-100 shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
            <FaExclamationTriangle className="mr-2 text-gray-600" size={25} /> Bajas Totales
          </h4>
          <p className="text-gray-900 text-2xl font-bold">{datosLote?.bajas != null ? datosLote.bajas : 'No disponible'}</p>
        </div>
        <div className="bg-sky-100 shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
            <TbHexagonLetterR className="mr-2 text-gray-600" size={30} /> Raza
          </h4>
          <p className="text-gray-900 text-2xl font-bold">{datosLote?.raza || 'No disponible'}</p>
        </div>
      </div>


      {/* Botones para seleccionar el periodo */}
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <button
          onClick={() => setPeriod('diario')}
          className={`px-5 py-3 rounded-lg text-xl font-semibold shadow-md transition-colors duration-300 ${period === 'diario' ? 'bg-red-700' : 'bg-red-700'
            } text-white hover:bg-red-800 w-full sm:w-auto`}
        >
          Diario
        </button>
        <button
          onClick={() => setPeriod('semanal')}
          className={`px-5 py-3 rounded-lg text-xl font-semibold shadow-md transition-colors duration-300 ${period === 'semanal' ? 'bg-blue-700' : 'bg-blue-700'
            } text-white hover:bg-blue-800 w-full sm:w-auto`}
        >
          Semanal
        </button>
        <button
          onClick={() => setPeriod('mensual')}
          className={`px-5 py-3 rounded-lg text-xl font-semibold shadow-md transition-colors duration-300 ${period === 'mensual' ? 'bg-gray-700' : 'bg-gray-600'
            } text-white hover:bg-gray-700 w-full sm:w-auto`}
        >
          Mensual
        </button>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
          <ProduccionGrafica idLote={loteActual} period={period} />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
          <ClasificacionGrafica idLote={loteActual} period={period} />
        </div>
      </div>
    </div>

  );
};

export default Dashboard;
