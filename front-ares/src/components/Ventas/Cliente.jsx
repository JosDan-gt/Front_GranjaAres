import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import ClienteForm from '../Ventas/ClientesForm';

const ClientesActivos = () => {
  const [clientes, setClientes] = useState([]);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [expanded, setExpanded] = useState(null); // Controla cuál fila está expandida
  const itemsPerPage = 10;

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = () => {
    axiosInstance.get('/api/Ventas/ClientesActivos')
      .then(response => setClientes(response.data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const handleSortByName = () => {
    const sortedClientes = [...clientes].sort((a, b) => {
      if (sortDirection === 'asc') {
        return a.nombreCliente.localeCompare(b.nombreCliente);
      }
      return b.nombreCliente.localeCompare(a.nombreCliente);
    });
    setClientes(sortedClientes);
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleFormSubmit = () => {
    fetchClientes();
    setShowForm(false);
    setEditingCliente(null);
  };

  const handleEditCliente = (cliente) => {
    setEditingCliente(cliente);
    setShowForm(true);
  };

  const handleDeleteCliente = async (clienteId) => {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este cliente?");
    if (confirmed) {
      try {
        await axiosInstance.put(`/updateestadocli?idCli=${clienteId}`, { estado: false });
        fetchClientes();
      } catch (error) {
        console.error('Error al eliminar el cliente:', error);
      }
    }
  };

  const handleToggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const totalPages = Math.ceil(clientes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = clientes.slice(startIndex, startIndex + itemsPerPage);

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
      <h2 className="text-3xl font-bold text-green-900 mb-6">Clientes Activos</h2>

      <button
        onClick={() => { setShowForm(!showForm); setEditingCliente(null); }}
        className="mb-6 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-300"
      >
        {showForm ? 'Ocultar Formulario' : 'Agregar Nuevo Cliente'}
      </button>

      {showForm && (
        <ClienteForm
          onCancel={() => { setShowForm(false); setEditingCliente(null); }}
          onSubmit={handleFormSubmit}
          cliente={editingCliente}
        />
      )}

      {clientes.length > 0 ? (
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
                  <th className="py-3 px-6 text-left text-sm font-semibold">Dirección</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold">Teléfono</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {currentItems.map((cliente) => (
                  <tr
                    key={cliente.clienteId}
                    className="border-b border-gray-200 hover:bg-yellow-50"
                  >
                    <td className="py-3 px-6 whitespace-nowrap">{cliente.nombreCliente}</td>
                    <td className="py-3 px-6 max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
                      <div
                        style={{ maxWidth: '200px', whiteSpace: expanded === cliente.clienteId ? 'normal' : 'nowrap', overflow: expanded === cliente.clienteId ? 'visible' : 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {cliente.direccion}
                      </div>
                      {cliente.direccion.length > 50 && (
                        <button
                          onClick={() => handleToggleExpand(cliente.clienteId)}
                          className="ml-2 text-blue-600 hover:underline"
                        >
                          {expanded === cliente.clienteId ? 'Ver menos' : 'Ver más'}
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-6 whitespace-nowrap">{cliente.telefono}</td>
                    <td className="py-3 px-6 whitespace-nowrap flex space-x-2">
                      <button
                        onClick={() => handleEditCliente(cliente)}
                        className="px-3 py-1 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteCliente(cliente.clienteId)}
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
        <p className="text-gray-700 text-lg">No hay clientes activos disponibles.</p>
      )}
    </div>
  );
};

export default ClientesActivos;
