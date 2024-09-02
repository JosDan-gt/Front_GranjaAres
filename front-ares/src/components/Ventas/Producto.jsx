import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import ProductoForm from './ProductosForm'; // Importa el componente de formulario

const ProductosActivos = () => {
  const [productos, setProductos] = useState([]);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = () => {
    axiosInstance.get('/api/Ventas/ProductosActivos')
      .then(response => setProductos(response.data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const handleSortByName = () => {
    const sortedProductos = [...productos].sort((a, b) => {
      if (sortDirection === 'asc') {
        return a.nombreProducto.localeCompare(b.nombreProducto);
      }
      return b.nombreProducto.localeCompare(a.nombreProducto);
    });
    setProductos(sortedProductos);
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleFormSubmit = () => {
    fetchProductos();
    setShowForm(false);
    setEditingProducto(null);
  };

  const handleEditProducto = (producto) => {
    setEditingProducto(producto);
    setShowForm(true);
  };

  const handleDeleteProducto = async (productoId) => {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (confirmed) {
      try {
        await axiosInstance.put(`https://localhost:7249/updateestadoprod?idProd=${productoId}`, {
          estado: false
        });
        fetchProductos(); // Refresca la lista de productos después de eliminar uno
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
      }
    }
  };

  const totalPages = Math.ceil(productos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = productos.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-6 bg-yellow-50 shadow-lg rounded-lg max-w-full w-full">
      <h2 className="text-3xl font-bold text-green-900 mb-6">Productos Activos</h2>

      <button
        onClick={() => { setShowForm(!showForm); setEditingProducto(null); }}
        className="mb-6 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-300"
      >
        {showForm ? 'Ocultar Formulario' : 'Agregar Nuevo Producto'}
      </button>

      {showForm && (
        <ProductoForm
          onCancel={() => { setShowForm(false); setEditingProducto(null); }}
          onSubmit={handleFormSubmit}
          producto={editingProducto}
        />
      )}

      {productos.length > 0 ? (
        <>
          <div className="w-full overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-green-700 text-white">
                <tr>
                  <th
                    className="py-3 px-6 text-left text-sm font-semibold cursor-pointer hover:bg-green-800"
                    onClick={handleSortByName}
                  >
                    Nombre {sortDirection === 'asc' ? '▲' : '▼'}
                  </th>
                  <th className="py-3 px-6 text-left text-sm font-semibold">Descripción</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {currentItems.map((producto) => (
                  <tr
                    key={producto.productoId}
                    className="border-b border-gray-200 hover:bg-yellow-50"
                  >
                    <td className="py-3 px-6 whitespace-nowrap">{producto.nombreProducto}</td>
                    <td className="py-3 px-6 max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
                      <div
                        style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {producto.descripcion}
                      </div>
                    </td>
                    <td className="py-3 px-6 whitespace-nowrap flex space-x-2">
                      <button
                        onClick={() => handleEditProducto(producto)}
                        className="px-3 py-1 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteProducto(producto.productoId)}
                        className="px-3 py-1 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-300"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handlePrevPage}
              className="px-6 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors duration-300"
              disabled={currentPage === 1}
            >
              Anterior
            </button>

            <span className="text-lg text-green-900">
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              className="px-6 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors duration-300"
              disabled={currentPage >= totalPages}
            >
              Siguiente
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-700 text-lg">No hay productos activos disponibles.</p>
      )}
    </div>
  );
};

export default ProductosActivos;
