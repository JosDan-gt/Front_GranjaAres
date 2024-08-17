import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, TimeScale, Filler } from 'chart.js';
import 'chartjs-adapter-date-fns';

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

const ProduccionGrafica = ({ produccionDiaria, produccionSemanal, produccionMensual }) => {
  
  const weekToDate = (weekNumber) => {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const startOfWeek = new Date(startOfYear.setDate(startOfYear.getDate() + (weekNumber - 1) * 7));
    return startOfWeek;
  };

  const processData = (data, type) => {
    const labels = data.map(entry => {
      if (type === 'diario') {
        return new Date(entry.fechaRegistro);
      } else if (type === 'semanal') {
        const weekNumber = parseInt(entry.fechaRegistro.replace('Semana ', ''), 10);
        return weekToDate(weekNumber);
      } else if (type === 'mensual') {
        return new Date(entry.fechaRegistro + '-01'); // Agregamos un día ficticio para usar Date
      }
    });

    return {
      labels,
      datasets: [
        {
          label: `Producción ${type.charAt(0).toUpperCase() + type.slice(1)}`,
          data: data.map(entry => ({
            x: type === 'diario' || type === 'mensual' ? new Date(entry.fechaRegistro) : weekToDate(parseInt(entry.fechaRegistro.replace('Semana ', ''), 10)),
            y: entry.produccion
          })),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
          fill: true,
        },
      ],
    };
  };

  const dataDiaria = processData(produccionDiaria, 'diario');
  const dataSemanal = processData(produccionSemanal, 'semanal');
  const dataMensual = processData(produccionMensual, 'mensual');

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Producción',
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'week', // Ajusta esto para mostrar semanas
          tooltipFormat: 'MMM yyyy',
        },
        title: {
          display: true,
          text: 'Fecha',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Producción',
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-white shadow-lg rounded-lg p-6 h-[400px] overflow-hidden">
        <h3 className="text-xl font-semibold mb-4">Producción Diaria</h3>
        <Line data={dataDiaria} options={options} />
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6 h-[400px] overflow-hidden">
        <h3 className="text-xl font-semibold mb-4">Producción Semanal</h3>
        <Line data={dataSemanal} options={options} />
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6 h-[400px] overflow-hidden">
        <h3 className="text-xl font-semibold mb-4">Producción Mensual</h3>
        <Line data={dataMensual} options={options} />
      </div>
    </div>
  );
};

export default ProduccionGrafica;
