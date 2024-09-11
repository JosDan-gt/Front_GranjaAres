import React, { createContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get('token') || localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true); // Si hay token, el usuario está autenticado
        } else {
            setIsAuthenticated(false); // Si no hay token, no está autenticado
        }
        setLoading(false); // Termina la carga
    }, []);

    if (loading) {
        return <div>Cargando...</div>; // Indicador de carga inicial
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
