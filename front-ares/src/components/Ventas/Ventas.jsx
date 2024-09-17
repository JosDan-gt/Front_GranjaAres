import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import DetalleVentaForm from './DetalleVentaForm';
import { PDFDownloadLink } from '@react-pdf/renderer';
import VentasGeneralesPDF from './VentasGeneralesPDF';
import VentasPorClientePDF from './VentasPorClientePDF';
import VentasPorFechaPDF from './VentasPorFechaPDF';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaEdit, FaFileDownload, FaSearch } from 'react-icons/fa';

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
  const [ventas, setVentas] = useState([]);
  const [originalVentas, setOriginalVentas] = useState([]);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Obtener ventas activas y detalles de venta
  const fetchVentasConDetalles = async () => {
    try {
      const response = await axiosInstance.get('/api/Ventas/VentasActivas');
      const ventasData = response.data;
      const detallesData = {};

      setOriginalVentas(ventasData);
      setVentas(ventasData);

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

  useEffect(() => {
    handleSearch();
  }, [selectedCliente, dateRange]);

  const handleSearch = () => {
    let filteredVentas = [...originalVentas];

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

    setVentas(filteredVentas);
  };

  const handleAdd = () => {
    setVentaSeleccionada(null);
    setIsEditing(false);
    setMostrarFormulario(true);
  };

  const handleEdit = (venta) => {
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

  // Paginación
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
    <div className="p-6 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 shadow-xl rounded-xl">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center tracking-wider">
        <FaSearch className="inline-block mb-2 text-blue-700" /> {/* Icono de búsqueda en el título */}
        Ventas Activas
      </h2>

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
      <div className="flex justify-center mb-4">
        <button
          onClick={handleAdd}
          className="px-6 py-3 text-white font-semibold rounded-full shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700"
        >
          <FaEdit className="inline-block mr-2" /> {/* Icono de editar en el botón */}
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
      <div className="overflow-x-auto max-w-full rounded-lg shadow-lg">
        <table className="w-full text-sm text-left text-gray-700 bg-white rounded-lg">
          <thead className="text-xs text-white uppercase bg-gradient-to-r from-blue-600 to-blue-800">
            <tr>
              <th className="px-6 py-3 text-center">Fecha de Venta</th>
              <th className="px-6 py-3 text-center">Cliente</th>
              <th className="px-6 py-3 text-center">Total Venta</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentVentas.length ? (
              currentVentas.map((venta) => (
                <React.Fragment key={venta.ventaId}>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-center">
                      {venta.fechaVenta ? new Date(venta.fechaVenta).toLocaleDateString() : 'Sin fecha'}
                    </td>
                    <td className="px-6 py-4 text-center">{getClienteNombre(venta.clienteId)}</td>
                    <td className="px-6 py-4 text-center">{venta.totalVenta}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleDetalles(venta.ventaId)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-md hover:from-green-400 hover:to-green-500 transition-all duration-300"
                      >
                        {detallesVisibles[venta.ventaId] ? 'Ocultar Detalles' : 'Ver Detalles'}
                      </button>
                      <button
                        onClick={() => handleEdit(venta)}
                        className="ml-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg shadow-md hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300"
                      >
                        <FaEdit className="inline-block mr-2" />
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
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No hay registros de ventas disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Botones de descarga de PDF */}
      <div className="flex justify-end space-x-4 mt-4">
        <PDFDownloadLink
          document={<VentasGeneralesPDF ventas={ventas} detallesVentas={detallesVentas} clientes={clientes} productos={productos} />}
          fileName="reporte_ventas_generales.pdf"
          className="flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-300 bg-blue-500 text-white hover:bg-blue-600"
        >
          {({ loading }) => (
            <>
              <FaFileDownload className="inline-block mr-2" />
              {loading ? 'Generando...' : 'Descargar Generales'}
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
              <FaFileDownload className="inline-block mr-2" />
              {loading ? 'Generando...' : 'Descargar por Cliente'}
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
              <FaFileDownload className="inline-block mr-2" />
              {loading ? 'Generando...' : 'Descargar por Fechas'}
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
