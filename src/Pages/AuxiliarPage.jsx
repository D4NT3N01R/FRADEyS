// src/Pages/AuxiliarPage.jsx
import React, { useState, useEffect } from 'react';
import { checkAuth, getEscenarios, getSolicitudesByEscenario } from '../services/mockBackend';
import PageBackground from '../Components/PageBackground';

// --- SUB-COMPONENTE: LOGIN ---
const LoginView = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleAuth = (e) => {
    e.preventDefault();
    if (checkAuth(password)) {
      onLogin();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-white/90 shadow-lg backdrop-blur-md p-8 text-center">
      <h2 className="text-2xl font-bold mb-6">Acceso Auxiliar</h2>
      <form onSubmit={handleAuth} className="grid gap-4">
        <input 
          type="password" 
          placeholder="Ingrese Contraseña" 
          className="w-full p-4 rounded-xl border border-gray-300 text-center text-lg"
          value={password}
          onChange={(e) => {setPassword(e.target.value); setError(false)}}
        />
        {error && <p className="text-red-600 font-bold">Contraseña Incorrecta</p>}
        <button className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition">
          Ingresar
        </button>
      </form>
    </div>
  );
};

// --- SUB-COMPONENTE: DASHBOARD ---
const DashboardView = ({ onLogout }) => {
  const [viewState, setViewState] = useState('MENU'); // 'MENU' o 'DETALLE'
  const [selectedEscenario, setSelectedEscenario] = useState(null);
  const [escenarios, setEscenarios] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    setEscenarios(getEscenarios());
  }, []);

  // Cargar solicitudes cuando se elige un escenario
  const handleSelectEscenario = (esc) => {
    setSelectedEscenario(esc);
    setSolicitudes(getSolicitudesByEscenario(esc));
    setViewState('DETALLE');
  };

  return (
    <div className="z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-white/20 bg-white/95 shadow-lg backdrop-blur-md flex flex-col min-h-[500px]">
      
      {/* Header Dashboard */}
      <header className="bg-black p-6 flex justify-between items-center text-white">
        <h1 className="text-xl font-bold">Panel de Laboratorista</h1>
        <button onClick={onLogout} className="text-sm bg-red-600 px-3 py-1 rounded hover:bg-red-700">Salir</button>
      </header>

      <div className="p-6 flex-1 overflow-y-auto">
        
        {/* VISTA 1: MENU DE ESCENARIOS */}
        {viewState === 'MENU' && (
          <div>
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Escenarios Disponibles</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {escenarios.map((esc) => (
                <button 
                  key={esc}
                  onClick={() => handleSelectEscenario(esc)}
                  className="h-32 rounded-xl border-2 border-dashed border-gray-400 flex items-center justify-center text-xl font-bold text-gray-600 hover:border-black hover:bg-gray-100 hover:text-black transition"
                >
                  {esc}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* VISTA 2: DATA GRID (TABLA) */}
        {viewState === 'DETALLE' && (
          <div className="animate-fade-in">
            <button 
              onClick={() => setViewState('MENU')} 
              className="mb-4 text-blue-600 font-semibold hover:underline flex items-center gap-2"
            >
              ← Volver a Escenarios
            </button>
            
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Solicitudes para: <span className="text-blue-700">{selectedEscenario}</span></h2>

            {solicitudes.length === 0 ? (
              <p className="text-gray-500 italic text-center py-10">No hay solicitudes pendientes para este escenario.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                      <th className="p-3 border-b">Hora</th>
                      <th className="p-3 border-b">Solicitante</th>
                      <th className="p-3 border-b">Tipo</th>
                      <th className="p-3 border-b">Material</th>
                      <th className="p-3 border-b">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {solicitudes.map((sol) => (
                      <tr key={sol.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-mono text-sm">{sol.hora}</td>
                        <td className="p-3">
                          <div className="font-bold">{sol.nombre}</div>
                          <div className="text-xs text-gray-500">{sol.matricula || sol.materia}</div>
                        </td>
                        <td className="p-3">
                          <span className={`text-xs font-bold px-2 py-1 rounded ${sol.tipo === 'Docente' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                            {sol.tipo}
                          </span>
                        </td>
                        <td className="p-3 text-sm max-w-xs truncate">
                          {Array.isArray(sol.materiales) ? sol.materiales.join(", ") : sol.materiales}
                        </td>
                        <td className="p-3">
                          <span className="text-yellow-600 font-bold text-sm">Pendiente</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL DE LA PAGINA ---
function AuxiliarPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="relative box-border flex min-h-screen items-center justify-center bg-gray-100 p-5 font-sans">
      <PageBackground />
      {isAuthenticated ? (
        <DashboardView onLogout={() => setIsAuthenticated(false)} />
      ) : (
        <LoginView onLogin={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
}

export default AuxiliarPage;