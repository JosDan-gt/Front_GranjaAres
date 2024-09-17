import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: 'https://backend20farmares-production.up.railway.app'
});

// Interceptor para añadir el token a las solicitudes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores 401 (token expirado)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Obtener el refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        
        // Si no hay refresh token, redirigir al login
        if (!refreshToken) {
          window.location.href = '/login';
          return;
        }

        // Enviar solicitud al backend para renovar el token de acceso
        const { data } = await axios.post('https://backend20farmares-production.up.railway.app/api/Auth/refresh', {
          refreshToken
        });

        // Guardar el nuevo token de acceso
        localStorage.setItem('token', data.accessToken);
        Cookies.set('token', data.accessToken, { expires: 1 });

        // Reintentar la solicitud original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axiosInstance(originalRequest);

      } catch (err) {
        // Si hay un error renovando el token, redirigir al login
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
