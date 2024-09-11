import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import DetalleVentaForm from './DetalleVentaForm';

const VentasActivas = () => {
  const [ventas, setVentas] = useState([]);
  const [detallesVentas, setDetallesVentas] = useState({});
  const [detallesVisibles, setDetallesVisibles] = useState({});
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]); // Aquí obtenemos los productos activos
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Obtener ventas activas
  const fetchVentas = async () => {
    try {
      const response = await axiosInstance.get('/api/Ventas/VentasActivas');
      setVentas(response.data);
    } catch (error) {
      console.error('Error fetching ventas activas:', error);
    }
  };

  // Obtener clientes y productos para asociar con sus nombres
  const fetchClientesYProductos = async () => {
    try {
      const clientesResponse = await axiosInstance.get('/api/Ventas/ClientesActivos');
      const productosResponse = await axiosInstance.get('/api/Ventas/ProductosActivos');
      setClientes(clientesResponse.data);
      setProductos(productosResponse.data); // Guardamos los productos en el estado
    } catch (error) {
      console.error('Error fetching clientes o productos:', error);
    }
  };

  useEffect(() => {
    fetchVentas();
    fetchClientesYProductos();
  }, []);

  const handleAdd = () => {
    setVentaSeleccionada(null);
    setIsEditing(false);
    setMostrarFormulario(true);
  };

  const handleEdit = async (venta) => {
    await fetchDetallesVenta(venta.ventaId);
    setVentaSeleccionada({
      ...venta,
      detallesVenta: detallesVentas[venta.ventaId] || [],
    });
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

  const getClienteNombre = (clienteId) => {
    const cliente = clientes.find((cliente) => cliente.clienteId === clienteId);
    return cliente ? cliente.nombreCliente : 'Desconocido';
  };

  const getProductoNombre = (productoId) => {
    const producto = productos.find((producto) => producto.productoId === productoId);
    return producto ? producto.nombreProducto : 'Desconocido';
  };

  const toggleDetalles = (ventaId) => {
    setDetallesVisibles((prev) => ({
      ...prev,
      [ventaId]: !prev[ventaId],
    }));
    if (!detallesVentas[ventaId]) {
      fetchDetallesVenta(ventaId);
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

  // Paginación: calcular ventas a mostrar
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVentas = ventas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(ventas.length / itemsPerPage);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
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

      {mostrarFormulario && (
        <div className="mb-6">
          <DetalleVentaForm
            venta={ventaSeleccionada}
            isEditing={isEditing}
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
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-xs md:text-sm">
            {currentVentas.map((venta, index) => (
              <React.Fragment key={venta.ventaId}>
                <tr
                  className={`border-b border-gray-200 hover:bg-yellow-50 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="py-3 px-4 md:px-6 whitespace-nowrap">
                    {new Date(venta.fechaVenta).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 md:px-6 whitespace-nowrap">
                    {getClienteNombre(venta.clienteId)}
                  </td>
                  <td className="py-3 px-4 md:px-6 whitespace-nowrap">{venta.totalVenta}</td>
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
                    <td colSpan="4" className="px-4 py-2 bg-gray-100">
                      <table className="table-auto w-full bg-gray-50">
                        <thead className="bg-gray-300">
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
                            <tr key={index} className="bg-gray-200">
                              <td className="px-4 py-2">{getProductoNombre(detalle.productoId)}</td>
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

        {/* Paginación */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-lg bg-green-600 text-white ${
              currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-700'
            }`}
          >
            Anterior
          </button>
          <span className="text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-lg bg-green-600 text-white ${
              currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-700'
            }`}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default VentasActivas;
