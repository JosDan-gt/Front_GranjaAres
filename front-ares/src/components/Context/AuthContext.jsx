
import React, { createContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { getRolesFromToken } from './jwtUtils'; // Importa la función desde el archivo de utilidades

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token') || localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      const roles = getRolesFromToken();
      setRoles(roles);
      console.log('Roles obtenidos:', roles); // Verifica los roles obtenidos
    } else {
      setIsAuthenticated(false);
      setRoles([]);
    }
    setLoading(false);
  }, []);
  

  if (loading) {
    return <div>Cargando...</div>; // Indicador de carga inicial
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, roles }}>
      {children}
    </AuthContext.Provider>
  );
};
