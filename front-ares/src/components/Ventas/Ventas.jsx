import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import DetalleVentaForm from './DetalleVentaForm';

const VentasActivas = () => {
  const [ventas, setVentas] = useState([]);
  const [detallesVentas, setDetallesVentas] = useState({});
  const [detallesVisibles, setDetallesVisibles] = useState({});
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Obtener ventas activas
  const fetchVentas = async () => {
    try {
      const response = await axiosInstance.get('/api/Ventas/VentasActivas');
      setVentas(response.data);
    } catch (error) {
      console.error('Error fetching ventas activas:', error);
    }
  };

  // Obtener clientes para asociar con sus nombres
  const fetchClientes = async () => {
    try {
      const response = await axiosInstance.get('/api/Ventas/ClientesActivos');
      setClientes(response.data);
    } catch (error) {
      console.error('Error fetching clientes:', error);
    }
  };

  useEffect(() => {
    fetchVentas();
    fetchClientes();
  }, []);

  // Manejar cuando se quiere agregar una nueva venta
  const handleAdd = () => {
    setVentaSeleccionada(null);
    setIsEditing(false);
    setMostrarFormulario(true);
  };

  // Manejar cuando se quiere editar una venta
  const handleEdit = (venta) => {
    setVentaSeleccionada(venta);
    setIsEditing(true);
    setMostrarFormulario(true);
  };

  const handleFormCancel = () => {
    setVentaSeleccionada(null);
    setMostrarFormulario(false);
  };

  const handleFormSubmit = () => {
    setVentaSeleccionada(null);
    setMostrarFormulario(false);
    fetchVentas();
  };

  // Encontrar el nombre del cliente en base al clienteId
  const getClienteNombre = (clienteId) => {
    const cliente = clientes.find((cliente) => cliente.clienteId === clienteId);
    return cliente ? cliente.nombreCliente : 'Desconocido';
  };

  const toggleDetalles = (ventaId) => {
    setDetallesVisibles((prev) => ({
      ...prev,
      [ventaId]: !prev[ventaId],
    }));
    if (!detallesVentas[ventaId]) {
      fetchDetallesVenta(ventaId); // Cargar los detalles si no están cargados
    }
  };

  const fetchDetallesVenta = async (ventaId) => {
    try {
      const response = await axiosInstance.get(`/api/Ventas/DetallesVentaActivos/${ventaId}`);
      setDetallesVentas((prev) => ({
        ...prev,
        [ventaId]: response.data,
      }));
    } catch (error) {
      console.error(`Error fetching detalles venta for ventaId ${ventaId}:`, error);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-yellow-50 shadow-lg rounded-lg max-w-full w-full">
      <h1 className="text-2xl md:text-3xl font-bold text-green-900 mb-4 md:mb-6 text-center md:text-left">
        Ventas Activas
      </h1>

      {/* Botón para agregar nueva venta */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6">
        <button
          onClick={handleAdd}
          className="w-full md:w-auto px-4 md:px-6 py-2 md:py-3 font-semibold rounded-lg transition-colors duration-300 bg-green-700 text-white hover:bg-green-800"
        >
          Agregar Nueva Venta
        </button>
      </div>

      {/* Mostrar formulario de nueva venta o edición si es necesario */}
      {mostrarFormulario && (
        <div className="mb-6">
          <DetalleVentaForm
            venta={ventaSeleccionada} // Si es null, el formulario está vacío para una nueva venta
            isEditing={isEditing} // Indica si estamos en modo edición o agregando
            onCancel={handleFormCancel}
            onSubmit={handleFormSubmit}
          />
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="py-3 px-4 md:px-6 text-left text-xs md:text-sm font-semibold">
                Fecha de Venta
              </th>
              <th className="py-3 px-4 md:px-6 text-left text-xs md:text-sm font-semibold">
                Cliente
              </th>
              <th className="py-3 px-4 md:px-6 text-left text-xs md:text-sm font-semibold">
                Total Venta
              </th>
              <th className="py-3 px-4 md:px-6 text-left text-xs md:text-sm font-semibold">
                Estado
              </th>
              <th className="py-3 px-4 md:px-6 text-left text-xs md:text-sm font-semibold">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-xs md:text-sm">
            {ventas.map((venta, index) => (
              <React.Fragment key={venta.ventaId}>
                <tr
                  className={`border-b border-gray-200 hover:bg-yellow-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                >
                  <td className="py-3 px-4 md:px-6 whitespace-nowrap">
                    {new Date(venta.fechaVenta).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 md:px-6 whitespace-nowrap">
                    {getClienteNombre(venta.clienteId)}
                  </td>
                  <td className="py-3 px-4 md:px-6 whitespace-nowrap">{venta.totalVenta}</td>
                  <td className="py-3 px-4 md:px-6 whitespace-nowrap">
                    {venta.estado ? 'Activo' : 'Inactivo'}
                  </td>
                  <td className="py-3 px-4 md:px-6 whitespace-nowrap flex space-x-2">
                    <button
                      onClick={() => toggleDetalles(venta.ventaId)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      {detallesVisibles[venta.ventaId] ? 'Ocultar Detalles' : 'Ver Detalles'}
                    </button>
                    <button
                      onClick={() => handleEdit(venta)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
                {detallesVisibles[venta.ventaId] && detallesVentas[venta.ventaId] && (
                  <tr>
                    <td colSpan="5" className="px-4 py-2 bg-gray-50">
                      <table className="table-auto w-full">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="px-4 py-2">Producto</th>
                            <th className="px-4 py-2">Tipo Empaque</th>
                            <th className="px-4 py-2">Tamaño Huevo</th>
                            <th className="px-4 py-2">Cantidad Vendida</th>
                            <th className="px-4 py-2">Precio Unitario</th>
                            <th className="px-4 py-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detallesVentas[venta.ventaId].map((detalle, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2">{detalle.productoId}</td>
                              <td className="px-4 py-2">{detalle.tipoEmpaque}</td>
                              <td className="px-4 py-2">{detalle.tamanoHuevo}</td>
                              <td className="px-4 py-2">{detalle.cantidadVendida}</td>
                              <td className="px-4 py-2">{detalle.precioUnitario}</td>
                              <td className="px-4 py-2">{detalle.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VentasActivas;
