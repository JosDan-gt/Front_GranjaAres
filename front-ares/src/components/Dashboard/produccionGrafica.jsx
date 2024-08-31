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

const ProduccionGrafica = ({ idLote, period }) => {
  const [productionData, setProductionData] = useState([]);
  const productionChartRef = useRef(null);

  useEffect(() => {
    if (idLote) {
      axiosInstance.get(`/api/dashboard/produccion/${idLote}/${period}`)
        .then(response => setProductionData(response.data))
        .catch(error => console.error('Error fetching production data:', error));
    }
  }, [idLote, period]);

  const productionChart = {
    labels: productionData.map(d => d.fechaRegistro),
    datasets: [
      {
        label: 'Producción',
        data: productionData.map(d => d.produccion),
        borderColor: 'rgba(107, 142, 35, 1)', // Verde oscuro
        backgroundColor: 'rgba(107, 142, 35, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Defectuosos',
        data: productionData.map(d => d.defectuosos),
        borderColor: 'rgba(139, 69, 19, 1)', // Marrón
        backgroundColor: 'rgba(139, 69, 19, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#3e3e3e', // Color natural para las etiquetas de la leyenda
        },
      },
      title: {
        display: true,
        text: `Producción y Defectuosos (${period.charAt(0).toUpperCase() + period.slice(1)})`,
        font: {
          size: 18,
          family: "'Comic Sans MS', cursive, sans-serif", // Estilo amigable y natural
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
      <h2 className="text-lg font-bold mb-4 text-center text-green-800">Producción</h2>
      <div className="w-full h-64">
        <Line ref={productionChartRef} data={productionChart} options={options} />
      </div>
    </div>
  );
};

export default ProduccionGrafica;
