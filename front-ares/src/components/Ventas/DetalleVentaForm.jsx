import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

const DetalleVentaForm = ({ venta, isEditing, onCancel, onSubmit }) => {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    clienteId: '',
    fechaVenta: '',
    detallesVenta: [{ productoId: '', tipoEmpaque: 'Cartón', tamanoHuevo: 'Pequeño', cantidadVendida: 1, precioUnitario: 0 }],
  });

  useEffect(() => {
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

    fetchClientesYProductos();

    if (isEditing && venta) {
      setFormData({
        clienteId: venta.clienteId,
        fechaVenta: venta.fechaVenta,
        detallesVenta: venta.detallesVenta || [{ productoId: '', tipoEmpaque: 'Cartón', tamanoHuevo: 'Pequeño', cantidadVendida: 1, precioUnitario: 0 }],
      });
    }
  }, [venta, isEditing]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación simple
    if (!formData.clienteId || !formData.fechaVenta || formData.detallesVenta.length === 0) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }

    const ventaData = {
      venta: {
        clienteId: parseInt(formData.clienteId),
        fechaVenta: formData.fechaVenta,
      },
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
        // Lógica de actualización
        await axiosInstance.put(`/api/Ventas/ActualizarVenta/${venta.ventaId}`, ventaData);
      } else {
        // Lógica de inserción
        await axiosInstance.post('/api/Ventas/InsertarDetallesVenta', ventaData);
      }
      onSubmit(); // Llamar al método onSubmit del componente padre
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
          onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
        >
          <option value="">Seleccione un cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.clienteId} value={cliente.clienteId}>
              {cliente.nombreCliente}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-green-900">Fecha de Venta</label>
        <input
          type="datetime-local"
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
          value={formData.fechaVenta}
          onChange={(e) => setFormData({ ...formData, fechaVenta: e.target.value })}
        />
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

      <div className="flex justify-between mt-4">
        <button type="button" onClick={onCancel} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Cancelar
        </button>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          {isEditing ? 'Actualizar Venta' : 'Agregar Venta'}
        </button>
      </div>
    </form>
  );
};

export default DetalleVentaForm;
