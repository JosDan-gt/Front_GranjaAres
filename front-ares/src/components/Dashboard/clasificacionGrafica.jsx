import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import axiosInstance from '../axiosInstance';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, TimeScale, Filler } from 'chart.js';

// Registrar las escalas y componentes necesarios
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

const ClasificacionGrafica = ({ idLote, period }) => {
  const [classificationData, setClassificationData] = useState([]);
  const classificationChartRef = useRef(null);

  useEffect(() => {
    if (idLote) {
      axiosInstance.get(`/api/dashboard/clasificacion/${idLote}/${period}`)
        .then(response => setClassificationData(response.data))
        .catch(error => console.error('Error fetching classification data:', error));
    }
  }, [idLote, period]);

  const processClassificationChartData = () => {
    const labels = [...new Set(classificationData.map(d => d.fechaRegistro))];
    const tamanoGroups = ['Pigui', 'Pequeño', 'Mediano', 'Grande', 'Extra Grande'];

    const datasets = tamanoGroups.map(tamano => ({
      label: tamano,
      data: labels.map(label => {
        const data = classificationData.find(d => d.fechaRegistro === label && d.tamano === tamano);
        return data ? data.totalUnitaria : 0;
      }),
      backgroundColor: getColorForTamano(tamano, true),
      borderColor: getColorForTamano(tamano),
      fill: true,
      tension: 0.4,
    }));

    return {
      labels,
      datasets,
    };
  };

  const getColorForTamano = (tamano, transparent = false) => {
    const colors = {
      'Pigui': 'rgba(139, 69, 19, 1)', // Marrón
      'Pequeño': 'rgba(85, 107, 47, 1)', // Verde oliva
      'Mediano': 'rgba(218, 165, 32, 1)', // Dorado
      'Grande': 'rgba(107, 142, 35, 1)', // Verde oscuro
      'Extra Grande': 'rgba(154, 205, 50, 1)', // Verde amarillento
    };
    const color = colors[tamano] || 'rgba(160, 82, 45, 1)'; // Marrón oscuro por defecto
    return transparent ? color.replace('1)', '0.2)') : color;
  };

  const classificationChart = processClassificationChartData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Clasificación (${period.charAt(0).toUpperCase() + period.slice(1)})`,
        font: {
          size: 18,
          family: "'Comic Sans MS', cursive, sans-serif", // Tipografía amigable
          color: '#3e3e3e',
        },
      },
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Fecha',
          font: {
            size: 14,
            family: "'Comic Sans MS', cursive, sans-serif",
            color: '#3e3e3e',
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cantidad',
          font: {
            size: 14,
            family: "'Comic Sans MS', cursive, sans-serif",
            color: '#3e3e3e',
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-green-600">
      <h2 className="text-lg font-bold mb-4 text-center text-green-800">Clasificación</h2>
      <div className="w-full h-64">
        <Line ref={classificationChartRef} data={classificationChart} options={options} />
      </div>
    </div>
  );
};

export default ClasificacionGrafica;
