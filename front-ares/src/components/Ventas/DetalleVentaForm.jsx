import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

const DetalleVentaForm = ({ venta, isEditing, onCancel, onSubmit }) => {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [direccionCliente, setDireccionCliente] = useState('');
  const [stockHuevos, setStockHuevos] = useState([]);
  const [formData, setFormData] = useState({
    clienteId: '',
    fechaVenta: '',
    detallesVenta: [{ productoId: '', tipoEmpaque: 'Cartón', tamanoHuevo: 'Pequeño', cantidadVendida: 1, precioUnitario: 0 }],
  });

  useEffect(() => {
    const fetchClientesYProductosYStock = async () => {
      try {
        const clientesResponse = await axiosInstance.get('/api/Ventas/ClientesActivos');
        const productosResponse = await axiosInstance.get('/api/Ventas/ProductosActivos');
        const stockResponse = await axiosInstance.get('/api/Ventas/stockhuevos');
        setClientes(clientesResponse.data);
        setProductos(productosResponse.data);
        setStockHuevos(stockResponse.data);
      } catch (error) {
        console.error('Error fetching clientes, productos o stock:', error);
      }
    };

    fetchClientesYProductosYStock();
  }, []);

  useEffect(() => {
    if (isEditing && venta) {
      setFormData({
        clienteId: venta.clienteId,
        fechaVenta: venta.fechaVenta,
        detallesVenta: venta.detallesVenta || [{ productoId: '', tipoEmpaque: 'Cartón', tamanoHuevo: 'Pequeño', cantidadVendida: 1, precioUnitario: 0 }],
      });
      const clienteSeleccionado = clientes.find(cliente => cliente.clienteId === venta.clienteId);
      if (clienteSeleccionado) {
        setDireccionCliente(clienteSeleccionado.direccion);
      }
    }
  }, [venta, isEditing, clientes]);

  const handleClienteChange = (e) => {
    const clienteId = e.target.value;
    setFormData({ ...formData, clienteId });

    const clienteSeleccionado = clientes.find(cliente => cliente.clienteId === parseInt(clienteId));
    if (clienteSeleccionado) {
      setDireccionCliente(clienteSeleccionado.direccion);
    } else {
      setDireccionCliente('');
    }
  };

  const handleDetailChange = (index, field, value) => {
    const newDetallesVenta = [...formData.detallesVenta];
    newDetallesVenta[index][field] = field === 'cantidadVendida' || field === 'precioUnitario' ? parseFloat(value) : value;
    setFormData({ ...formData, detallesVenta: newDetallesVenta });
  };

  const handleAddDetail = () => {
    setFormData({
      ...formData,
      detallesVenta: [...formData.detallesVenta, { productoId: '', tipoEmpaque: 'Cartón', tamanoHuevo: 'Pequeño', cantidadVendida: 1, precioUnitario: 0 }],
    });
  };

  const handleRemoveDetail = (index) => {
    const newDetallesVenta = formData.detallesVenta.filter((_, i) => i !== index);
    setFormData({ ...formData, detallesVenta: newDetallesVenta });
  };

  const handleClearForm = () => {
    setFormData({
      clienteId: '',
      fechaVenta: '',
      detallesVenta: [{ productoId: '', tipoEmpaque: 'Cartón', tamanoHuevo: 'Pequeño', cantidadVendida: 1, precioUnitario: 0 }],
    });
    setDireccionCliente('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.clienteId || !formData.fechaVenta || formData.detallesVenta.length === 0) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }

    const ventaData = {
      ventaId: venta?.ventaId || 0,
      clienteId: parseInt(formData.clienteId),
      detallesVenta: formData.detallesVenta.map(detalle => ({
        productoId: parseInt(detalle.productoId),
        tipoEmpaque: detalle.tipoEmpaque,
        tamanoHuevo: detalle.tamanoHuevo,
        cantidadVendida: parseInt(detalle.cantidadVendida),
        precioUnitario: parseFloat(detalle.precioUnitario),
      })),
    };

    try {
      if (isEditing) {
        await axiosInstance.put(`/api/Ventas/ActualizarVenta`, ventaData);
      } else {
        await axiosInstance.post('/api/Ventas/InsertarDetallesVenta', ventaData);
      }
      onSubmit();
    } catch (error) {
      console.error('Error al guardar la venta:', error);
      alert('Error al guardar la venta. Revisa la consola para más detalles.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-yellow-50 p-6 rounded-lg shadow-lg">
      <div>
        <label className="block text-sm font-semibold text-green-900">Cliente</label>
        <select
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
          value={formData.clienteId}
          onChange={handleClienteChange}
        >
          <option value="">Seleccione un cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.clienteId} value={cliente.clienteId}>
              {cliente.nombreCliente}
            </option>
          ))}
        </select>
      </div>

      {direccionCliente && (
        <div>
          <label className="block text-sm font-semibold text-green-900">Dirección</label>
          <input
            type="text"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg bg-gray-200 cursor-not-allowed"
            value={direccionCliente}
            readOnly
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-green-900">Fecha de Venta</label>
        <input
          type="datetime-local"
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
          value={formData.fechaVenta}
          onChange={(e) => setFormData({ ...formData, fechaVenta: e.target.value })}
        />
      </div>

      {/* Mostrar stock disponible */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-green-900 mb-2 text-center">Stock Disponible</h3>
        <table className="table-auto w-full bg-gray-50 border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="px-4 py-2 text-center">Tamaño</th>
              <th className="px-4 py-2 text-center">Cajas</th>
              <th className="px-4 py-2 text-center">Cartones Extras</th>
              <th className="px-4 py-2 text-center">Huevos Sueltos</th>
            </tr>
          </thead>
          <tbody>
            {stockHuevos.map((stock, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                <td className="px-4 py-2 text-center">{stock.tamano}</td>
                <td className={`px-4 py-2 text-center ${stock.cajas === 0 ? 'text-red-500' : ''}`}>
                  {stock.cajas}
                </td>
                <td className={`px-4 py-2 text-center ${stock.cartonesExtras === 0 ? 'text-red-500' : ''}`}>
                  {stock.cartonesExtras}
                </td>
                <td className={`px-4 py-2 text-center ${stock.huevosSueltos === 0 ? 'text-red-500' : ''}`}>
                  {stock.huevosSueltos}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <div className="space-y-4">
        {formData.detallesVenta.map((detalle, index) => (
          <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-md">
            <div className="grid grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-semibold text-green-900">Producto</label>
                <select
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                  value={detalle.productoId}
                  onChange={(e) => handleDetailChange(index, 'productoId', e.target.value)}
                >
                  <option value="">Seleccione un producto</option>
                  {productos.map((producto) => (
                    <option key={producto.productoId} value={producto.productoId}>
                      {producto.nombreProducto}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-green-900">Tipo Empaque</label>
                <select
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                  value={detalle.tipoEmpaque}
                  onChange={(e) => handleDetailChange(index, 'tipoEmpaque', e.target.value)}
                >
                  <option value="Cartón">Cartón</option>
                  <option value="Caja">Caja</option>
                  <option value="Sueltos">Sueltos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-green-900">Tamaño Huevo</label>
                <select
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                  value={detalle.tamanoHuevo}
                  onChange={(e) => handleDetailChange(index, 'tamanoHuevo', e.target.value)}
                >
                  <option value="Extra Grande">Extra Grande</option>
                  <option value="Grande">Grande</option>
                  <option value="Mediano">Mediano</option>
                  <option value="Pequeño">Pequeño</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-green-900">Cantidad Vendida</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                  value={detalle.cantidadVendida}
                  onChange={(e) => handleDetailChange(index, 'cantidadVendida', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-green-900">Precio Unitario</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                  value={detalle.precioUnitario}
                  onChange={(e) => handleDetailChange(index, 'precioUnitario', e.target.value)}
                />
              </div>

              <div className="flex items-center">
                <button type="button" onClick={() => handleRemoveDetail(index)} className="text-red-600 mt-6">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddDetail}
          className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
        >
          Agregar Detalle
        </button>
      </div>

      <div className="flex justify-between mt-4 space-x-4">
        <button type="button" onClick={handleClearForm} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          Limpiar
        </button>
        <div className="flex space-x-4">
          <button type="button" onClick={onCancel} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Cancelar
          </button>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            {isEditing ? 'Actualizar Venta' : 'Agregar Venta'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default DetalleVentaForm;
