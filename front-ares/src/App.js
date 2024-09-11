import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import Dashboard from './components/Dashboard.jsx';
import Lote from './components/Lote/Lote.jsx';
import ClasificacionH from './components/Produccion/ClasificacionH.jsx';
import EstadoLote from './components/EstadoLote/EstadoLote.jsx';
import { ErrorProvider } from './components/Error/ErrorContext.jsx';
import Corral from './components/Corral/Corral.jsx';
import GestionLote from './components/GestionLote.jsx';
import Login from './components/Login/Login.jsx';
import ProtectedRoute from './components/Login/ProtectedRoute.jsx';
import { AuthProvider } from './components/Context/AuthContext.jsx';
import ProduccionG from './components/Produccion/ProduccionG.jsx';
import Cliente from './components/Ventas/Cliente.jsx';
import Producto from './components/Ventas/Producto.jsx';
import Ventas from './components/Ventas/Ventas.jsx';
import RazaG from './components/Razas/RazasG.jsx';

function App() {
  console.log('App rendered');  // Diagnóstico: cuándo se renderiza la App

  return (
    <AuthProvider>
      <ErrorProvider>
        <Router>
          <Routes>
            {/* Ruta de login accesible sin autenticación */}
            <Route path="/login" element={<Login />} />

            {/* Ruta protegida para todo lo demás */}
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <div className="flex flex-col min-h-screen">
                    <Header />
                    <div className="flex flex-1">
                      <Sidebar />
                      <main className="flex-1 p-4 bg-gray-100">
                        <Routes>
                          {/* Redirige al dashboard si accede a la raíz */}
                          <Route path="/" element={<Navigate to="/dashboard" />} />

                          {/* Rutas protegidas */}
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/lotes" element={<Lote />} />
                          <Route path="/produccionG/:idLote" element={<ProduccionG />} />
                          <Route path="/clasificacion/:id" element={<ClasificacionH />} />
                          <Route path="/estado/:idLote" element={<EstadoLote />} />
                          <Route path="/corrales" element={<Corral />} />
                          <Route path="/razasg" element={<RazaG />} />
                          <Route path="/gestion" element={<GestionLote />} />
                          <Route path="/cliente" element={<Cliente />} />
                          <Route path="/producto" element={<Producto />} />
                          <Route path="/venta" element={<Ventas />} />
                        </Routes>
                      </main>
                    </div>
                    <Footer />
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ErrorProvider>
    </AuthProvider>
  );
}

export default App;
