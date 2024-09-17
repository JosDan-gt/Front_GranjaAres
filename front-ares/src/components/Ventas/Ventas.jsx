import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import DetalleVentaForm from './DetalleVentaForm';
import { PDFDownloadLink } from '@react-pdf/renderer';
import VentasGeneralesPDF from './VentasGeneralesPDF';
import VentasPorClientePDF from './VentasPorClientePDF';
import VentasPorFechaPDF from './VentasPorFechaPDF';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const VentasActivas = () => {

  const [detallesVentas, setDetallesVentas] = useState({});
  const [detallesVisibles, setDetallesVisibles] = useState({});
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Filtros
  const [selectedCliente, setSelectedCliente] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [ventas, setVentas] = useState([]);  // Ventas filtradas
  const [originalVentas, setOriginalVentas] = useState([]);  // Ventas originales sin filtrar


  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Obtener ventas activas y detalles de venta
  const fetchVentasConDetalles = async () => {
    try {
      const response = await axiosInstance.get('/api/Ventas/VentasActivas');
      const ventasData = response.data;
      const detallesData = {};

      // Guardar las ventas originales sin filtrar
      setOriginalVentas(ventasData);
      setVentas(ventasData); // Mostrar las ventas al cargar por primera vez

      // Cargar detalles de todas las ventas para el PDF
      await Promise.all(
        ventasData.map(async (venta) => {
          const detallesResponse = await axiosInstance.get(`/api/Ventas/DetallesVentaActivos/${venta.ventaId}`);
          detallesData[venta.ventaId] = detallesResponse.data;
        })
      );

      setDetallesVentas(detallesData);
    } catch (error) {
      console.error('Error fetching ventas activas y detalles:', error);
    }
  };


  // Obtener clientes y productos
  const fetchClientesYProductos = async () => {
    try {
      const clientesResponse = await axiosInstance.get('/api/Ventas/ClientesActivos');
      const productosResponse = await axiosInstance.get('/api/Ventas/ProductosActivos');
      setClientes(clientesResponse.data);
      setProductos(productosResponse.data);
    } catch (error) {
      console.error('Error fetching clientes o productos:', error);
    }
  };

  useEffect(() => {
    fetchVentasConDetalles();
    fetchClientesYProductos();
  }, []);

  // Aplicar filtros automáticamente al cambiar cliente o fecha
  useEffect(() => {
    handleSearch();
  }, [selectedCliente, dateRange]);

  const handleSearch = () => {
    let filteredVentas = [...originalVentas]; // Utilizamos las ventas originales

    if (selectedCliente) {
      filteredVentas = filteredVentas.filter(
        (venta) => String(venta.clienteId) === String(selectedCliente)
      );
    }

    const [startDate, endDate] = dateRange;

    if (startDate && endDate) {
      filteredVentas = filteredVentas.filter((venta) => {
        const ventaFecha = new Date(venta.fechaVenta);
        return ventaFecha >= startDate && ventaFecha <= endDate;
      });
    }

    setVentas(filteredVentas); // Actualizamos las ventas filtradas
  };



  const handleAdd = () => {
    setVentaSeleccionada(null);
    setIsEditing(false);
    setMostrarFormulario(true);
  };

  const handleEdit = async (venta) => {
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
    fetchVentasConDetalles();
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

  const Pagination = ({ totalPages, currentPage, paginate }) => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center mt-4">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-3 py-1 mx-1 border border-gray-300 rounded-md ${currentPage === number
              ? 'bg-green-700 text-white'
              : 'bg-white text-green-700 hover:bg-green-200'
              }`}
          >
            {number}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 bg-yellow-50 shadow-lg rounded-lg max-w-full w-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-green-900 mb-4 sm:mb-6 text-center">
        Ventas Activas
      </h1>

      {/* Filtros arriba de la tabla */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <div className="mb-4 sm:mb-0">
          <label className="block text-sm font-medium text-gray-700">Cliente</label>
          <select
            value={selectedCliente}
            onChange={(e) => setSelectedCliente(e.target.value)}
            className="mt-1 block w-full sm:w-auto px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Todos</option>
            {clientes.map((cliente) => (
              <option key={cliente.clienteId} value={cliente.clienteId}>
                {cliente.nombreCliente}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 sm:mb-0">
          <label className="block text-sm font-medium text-gray-700">Rango de Fecha</label>
          <div className="flex space-x-2">
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              className="px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholderText="Seleccionar rango de fechas"
              isClearable
            />
          </div>
        </div>
      </div>

      {/* Botón para agregar nueva venta */}
      <div className="flex justify-center mb-4 md:mb-6">
        <button
          onClick={handleAdd}
          className="w-full md:w-auto px-6 py-3 font-semibold rounded-lg transition-colors duration-300 bg-green-700 text-white hover:bg-green-800"
        >
          Agregar Nueva Venta
        </button>
      </div>

      {mostrarFormulario && (
        <DetalleVentaForm
          venta={ventaSeleccionada}
          isEditing={isEditing}
          onCancel={handleFormCancel}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Tabla de ventas */}
      <div className="w-full overflow-x-auto mb-6">
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
                  className={`border-b border-gray-200 hover:bg-yellow-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                >
                  <td className="py-3 px-4 md:px-6 whitespace-nowrap">
                    {venta.fechaVenta ? new Date(venta.fechaVenta).toLocaleDateString() : 'Sin fecha'}
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
      </div>

      {/* Botones de descarga de PDF con íconos */}
      <div className="flex justify-end space-x-4">
        <PDFDownloadLink
          document={<VentasGeneralesPDF ventas={ventas} detallesVentas={detallesVentas} clientes={clientes} productos={productos} />}
          fileName="reporte_ventas_generales.pdf"
          className="flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-300 bg-blue-500 text-white hover:bg-blue-600"
        >
          {({ loading }) => (
            <>
              <span className="mr-2">{loading ? 'Generando...' : 'Descargar Generales'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m6-6H6m18 6l-6 6m0-6l-6-6" />
              </svg>
            </>
          )}
        </PDFDownloadLink>

        <PDFDownloadLink
          document={<VentasPorClientePDF ventas={ventas} detallesVentas={detallesVentas} clientes={clientes} productos={productos} />}
          fileName="reporte_ventas_por_cliente.pdf"
          className="flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-300 bg-blue-500 text-white hover:bg-blue-600"
        >
          {({ loading }) => (
            <>
              <span className="mr-2">{loading ? 'Generando...' : 'Descargar por Cliente'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m6-6H6m18 6l-6 6m0-6l-6-6" />
              </svg>
            </>
          )}
        </PDFDownloadLink>

        <PDFDownloadLink
          document={<VentasPorFechaPDF ventas={ventas} detallesVentas={detallesVentas} clientes={clientes} productos={productos} fechaInicio={startDate} fechaFin={endDate} />}
          fileName="reporte_ventas_por_fechas.pdf"
          className="flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-300 bg-blue-500 text-white hover:bg-blue-600"
        >
          {({ loading }) => (
            <>
              <span className="mr-2">{loading ? 'Generando...' : 'Descargar por Fechas'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m6-6H6m18 6l-6 6m0-6l-6-6" />
              </svg>
            </>
          )}
        </PDFDownloadLink>
      </div>

      {/* Paginación */}
      <Pagination totalPages={totalPages} currentPage={currentPage} paginate={goToPage} />
    </div>
  );
};

export default VentasActivas;
