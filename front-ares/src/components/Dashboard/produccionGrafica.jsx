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
        borderColor: 'rgba(0, 123, 255, 1)',    // Azul profundo
        backgroundColor: 'rgba(0, 123, 255, 0.2)',  // Fondo transparente
        fill: false,  // Sin relleno
        tension: 0,   // Líneas rectas
      },
      {
        label: 'Defectuosos',
        data: productionData.map(d => d.defectuosos),
        borderColor: 'rgba(220, 53, 69, 1)', // Rojo oscuro
        backgroundColor: 'rgba(220, 53, 69, 0.2)',
        fill: false,  // Sin relleno
        tension: 0,   // Líneas rectas
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom', // Leyenda en la parte inferior
        labels: {
          font: {
            family: "'Helvetica Neue', sans-serif", // Tipografía minimalista
            size: 12,
            color: '#333',
          },
          boxWidth: 10, // Tamaño reducido de la caja de leyenda
          padding: 20,  // Espaciado entre etiquetas
        },
      },
      title: {
        display: true,
        text: `Producción y Defectuosos (${period.charAt(0).toUpperCase() + period.slice(1)})`,
        font: {
          size: 18,
          family: "'Helvetica Neue', sans-serif", // Tipografía limpia y profesional
          color: '#333',
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
            size: 12,
            family: "'Helvetica Neue', sans-serif",
            color: '#333',
          },
        },
        grid: {
          display: false, // Ocultar líneas del grid en el eje X
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cantidad',
          font: {
            size: 12,
            family: "'Helvetica Neue', sans-serif",
            color: '#333',
          },
        },
        grid: {
          color: 'rgba(108, 117, 125, 0.1)', // Líneas de grid discretas en el eje Y
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
