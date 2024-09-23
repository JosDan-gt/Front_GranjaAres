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
      'Pigui': 'rgba(0, 123, 255, 1)',    // Azul profundo
      'Pequeño': 'rgba(0, 200, 150, 1)',  // Verde azulado
      'Mediano': 'rgba(255, 193, 7, 1)',  // Amarillo dorado
      'Grande': 'rgba(40, 167, 69, 1)',   // Verde brillante
      'Extra Grande': 'rgba(220, 53, 69, 1)', // Rojo oscuro
    };
    const color = colors[tamano] || 'rgba(108, 117, 125, 1)'; // Gris por defecto
    return transparent ? color.replace('1)', '0.3)') : color;
  };



  const classificationChart = processClassificationChartData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: "'Helvetica Neue', sans-serif", // Tipografía moderna y limpia
            size: 12,
            color: '#333',
          },
          boxWidth: 10, // Caja de leyenda más pequeña
          padding: 20,  // Espaciado mayor entre etiquetas
        },
      },
      title: {
        display: true,
        text: `Clasificación (${period.charAt(0).toUpperCase() + period.slice(1)})`,
        font: {
          size: 18,
          family: "'Helvetica Neue', sans-serif",
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
          display: false, // Eliminar las líneas del grid en el eje X
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
          color: 'rgba(108, 117, 125, 0.1)', // Líneas de grid muy suaves
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
