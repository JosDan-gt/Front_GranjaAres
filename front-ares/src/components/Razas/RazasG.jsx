import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance'; // Asegúrate de que la ruta sea la correcta

const RazaG = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Función para obtener los datos de la API usando axios
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/razaG/getrazaG');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Raza de Gallinas</h1>
      <table>
        <thead>
          <tr>
            <th>ID Raza</th>
            <th>Raza</th>
            <th>Origen</th>
            <th>Color</th>
            <th>Color Huevo</th>
            <th>Características Específicas</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {data.map((raza) => (
            <tr key={raza.idRaza}>
              <td>{raza.idRaza}</td>
              <td>{raza.raza}</td>
              <td>{raza.origen}</td>
              <td>{raza.color}</td>
              <td>{raza.colorH}</td>
              <td>{raza.caractEspec}</td>
              <td>{raza.estado ? 'Activo' : 'Inactivo'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RazaG;
