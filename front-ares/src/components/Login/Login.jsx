import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Importa js-cookie
import { AuthContext } from '../Context/AuthContext'; // Importa AuthContext si lo estás utilizando
import fondoLogin from '../Img/FallGuys.jpg';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Usa el AuthContext si estás manejando la autenticación globalmente
    const { setIsAuthenticated } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://backend20farmares-production.up.railway.app/api/Auth/login', {
                username,
                password,
            });

            // Imprimir la respuesta completa para ver dónde está el token
            console.log('Respuesta completa del backend:', response.data);

            // Revisa si el token tiene otro nombre, por ejemplo: accessToken
            const token = response.data.token || response.data.accessToken;

            if (token) {
                // Guardar el token en localStorage y en cookies
                localStorage.setItem('token', token);
                Cookies.set('token', token, { expires: 1 }); // La cookie expira en 1 día

                // Actualizar el estado de autenticación
                setIsAuthenticated(true);

                // Redirigir al dashboard
                navigate('/dashboard', { replace: true });
                
            } else {
                console.error('Token no encontrado en la respuesta del backend');
                setError('Error al iniciar sesión, token no recibido.');
            }
        } catch (err) {
            setError('Nombre de usuario o contraseña incorrectos. Inténtalo de nuevo.');
        }
    };



    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url(${fondoLogin})` }}
        >
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Nombre de Usuario</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
