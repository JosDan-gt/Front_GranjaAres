// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './components/Dashboard.jsx';
import ProduccionG from './components/Produccion/ProduccionG.jsx';
import Lote from './components/Lote/Lote.jsx';
import ClasificacionH from './components/Produccion/ClasificacionH.jsx';
import { ErrorProvider } from './components/Error/ErrorContext.jsx'; // Importa el ErrorProvider

function App() {
  return (
    <ErrorProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-4 bg-gray-100">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/lotes" element={<Lote />} />
                <Route path="/produccion/:idLote" element={<ProduccionG />} />
                <Route path="/clasificacion/:id" element={<ClasificacionH />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </Router>
    </ErrorProvider>
  );
}

export default App;
