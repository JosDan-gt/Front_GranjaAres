import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('token');

const axiosInstance = axios.create({
    baseURL: 'https://localhost:7249',
    headers: {
        Authorization: `Bearer ${token}`, // Agrega el token en las cabeceras de autorización
    },
});

export default axiosInstance;
