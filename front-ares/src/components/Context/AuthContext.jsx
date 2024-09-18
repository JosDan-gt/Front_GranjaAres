import { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // Si no has instalado js-cookie, usa: npm install js-cookie
import { getRolesFromToken } from './jwtUtils'; // Asegúrate de que esta función está definida y funciona correctamente

// Crear el contexto de autenticación
export const AuthContext = createContext(); // Define y exporta el contexto

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token') || localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      const userRoles = getRolesFromToken();
      setRoles(userRoles);
    } else {
      setIsAuthenticated(false);
      setRoles([]);
    }
    setLoading(false);
  }, []);

  const logout = () => {
    Cookies.remove('token');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setRoles([]);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, roles, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
