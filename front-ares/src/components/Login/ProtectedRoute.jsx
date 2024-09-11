import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext'; // Verifica la ruta correcta

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  // Si el usuario no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Si está autenticado, renderiza los hijos
  return children;
};

export default ProtectedRoute;
