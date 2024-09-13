import { jwtDecode } from "jwt-decode"; // Cambiar esto si fuera necesario
import Cookies from 'js-cookie';

// Función para obtener los roles desde el token
export const getRolesFromToken = () => {
  const token = Cookies.get('token') || localStorage.getItem('token');
  if (!token) return [];

  try {
    const decodedToken = jwtDecode(token);
    console.log('Decoded Token:', decodedToken); // Verifica el contenido del token decodificado
    return decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];
  } catch (error) {
    console.error("Error decoding token:", error);
    return [];
  }
};

