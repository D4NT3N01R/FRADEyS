// src/Pages/AuxiliarPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  checkAuth, 
  getUniqueEscenarios, 
  getSolicitudesByEscenario, 
  updateStatus, 
  getCanceladas 
} from '../services/api'; // Importamos las nuevas funciones
import PageBackground from '../Components/PageBackground';
import { createPortal } from 'react-dom';

// --- MODAL PARA MOTIVO DE CANCELACIÓN ---
const CancelacionModal = ({ isOpen, onClose, onConfirm }) => {
  const [motivo, setMotivo] = useState('');

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-fade-in-up">
        <h3 className="text-xl font-bold text-red-600 mb-2">Cancelar Solicitud</h3>
        <p className="text-gray-600 mb-4 text-sm">Por favor, indica el motivo de la cancelación:</p>
        
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
          rows="3"
          placeholder="Ej: Material no disponible, error en captura..."
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />
        
        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
          <button 
            onClick={() => {
              if (motivo.trim()) {
                onConfirm(motivo);
                setMotivo('');
              } else {
                alert("Escribe un motivo.");
              }
            }}
            className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700"
          >
            Confirmar Cancelación
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// --- LOGIN (Sin Cambios) ---
const LoginView = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const handleAuth = (e) => {
    e.preventDefault();
    if (checkAuth(password)) onLogin();
    else { setError(true); setPassword(''); }
  };
  return (
    <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-white/90 shadow-lg backdrop-blur-md p-8 text-center">
      <h2 className="text-2xl font-bold mb-6">Acceso Auxiliar</h2>
      <form onSubmit={handleAuth} className="grid gap-4">
        <input type="password" placeholder="Ingrese Contraseña" className="w-full p-4 rounded-xl border border-gray-300 text-center text-lg" value={password} onChange={(e) => {setPassword(e.target.value); setError(false)}} />
        {error && <p className="text-red-600 font-bold">Contraseña Incorrecta</p>}
        <button className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition">Ingresar</button>
      </form>
    </div>
  );
};

// --- DASHBOARD ---
const DashboardView = ({ onLogout }) => {
  const [viewState, setViewState] = useState('MENU'); // 'MENU', 'DETALLE', 'CANCELADAS'
  const [selectedEscenario, setSelectedEscenario] = useState(null);
  const [escenarios, setEscenarios] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [listaCanceladas, setListaCanceladas] = useState([]);

  // Estado para manejar la cancelación
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [solicitudToCancel, setSolicitudToCancel] = useState(null);

  useEffect(() => {
    loadEscenarios();
  }, []);

  const loadEscenarios = async () => {
    const data = await getUniqueEscenarios();
    setEscenarios(data);
  };

  const handleSelectEscenario = async (esc) => {
    setSelectedEscenario(esc);
    const data = await getSolicitudesByEscenario(esc);
    // Filtramos visualmente las canceladas de la vista principal del escenario
    // para que se vayan a su propia sección, aunque json-server las traiga.
    setSolicitudes(data.filter(s => s.status !== 'Cancelado'));
    setViewState('DETALLE');
  };

  const handleViewCanceladas = async () => {
    const data = await getCanceladas();
    setListaCanceladas(data);
    setViewState('CANCELADAS');
  };

  // --- LÓGICA DE CAMBIO DE ESTADO ---
  const handleStatusChange = async (id, newStatus) => {
    // Si elige cancelar, abrimos modal y pausamos la actualización
    if (newStatus === 'Cancelado') {
      setSolicitudToCancel(id);
      setCancelModalOpen(true);
      return;
    }

    // Si es Entregado o Pendiente, actualizamos directo
    const success = await updateStatus(id, newStatus);
    if (success) {
      // Recargar la tabla actual
      const data = await getSolicitudesByEscenario(selectedEscenario);
      setSolicitudes(data.filter(s => s.status !== 'Cancelado'));
    }
  };

  const confirmCancelacion = async (motivo) => {
    if (solicitudToCancel) {
      const success = await updateStatus(solicitudToCancel, 'Cancelado', motivo);
      if (success) {
        setCancelModalOpen(false);
        setSolicitudToCancel(null);
        // Recargar tabla
        const data = await getSolicitudesByEscenario(selectedEscenario);
        setSolicitudes(data.filter(s => s.status !== 'Cancelado'));
      }
    }
  };

  return (
    <>
      <CancelacionModal 
        isOpen={cancelModalOpen} 
        onClose={() => setCancelModalOpen(false)} 
        onConfirm={confirmCancelacion} 
      />

      <div className="z-10 w-full max-w-6xl overflow-hidden rounded-2xl border border-white/20 bg-white/95 shadow-lg backdrop-blur-md flex flex-col min-h-[500px]">
        
        <header className="bg-black p-6 flex justify-between items-center text-white">
          <h1 className="text-xl font-bold">Panel de Laboratorista</h1>
          <button onClick={onLogout} className="text-sm bg-red-600 px-3 py-1 rounded hover:bg-red-700">Salir</button>
        </header>

        <div className="p-6 flex-1 overflow-y-auto">
          
          {/* VISTA 1: MENU PRINCIPAL */}
          {viewState === 'MENU' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Escenarios Activos</h2>
                {/* Botón para ver canceladas */}
                <button 
                  onClick={handleViewCanceladas}
                  className="text-sm font-bold text-red-600 border border-red-200 bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition flex items-center gap-2"
                >
                  ⚠ Ver Solicitudes Canceladas
                </button>
              </div>

              {escenarios.length === 0 ? (
                <p className="text-center text-gray-500 mt-10">No hay solicitudes activas.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {escenarios.map((esc) => (
                    <button 
                      key={esc}
                      onClick={() => handleSelectEscenario(esc)}
                      className="h-32 rounded-xl border-2 border-dashed border-gray-400 flex items-center justify-center text-xl font-bold text-gray-600 hover:border-black hover:bg-gray-100 hover:text-black transition uppercase"
                    >
                      {esc}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VISTA 2: TABLA DE SOLICITUDES (POR ESCENARIO) */}
          {viewState === 'DETALLE' && (
            <div className="animate-fade-in">
              <button 
                onClick={() => { setViewState('MENU'); loadEscenarios(); }} 
                className="mb-4 text-blue-600 font-semibold hover:underline flex items-center gap-2"
              >
                ← Volver a Escenarios
              </button>
              
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">
                Solicitudes en: <span className="text-blue-700 uppercase">{selectedEscenario}</span>
              </h2>

              {solicitudes.length === 0 ? (
                <p className="text-gray-500 italic text-center py-10">No hay solicitudes pendientes o activas.</p>
              ) : (
                <div className="overflow-x-auto min-h-[300px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                        <th className="p-3 border-b w-24">Folio</th>
                        <th className="p-3 border-b w-20">Hora</th>
                        <th className="p-3 border-b w-48">Solicitante</th>
                        <th className="p-3 border-b w-24">Tipo</th>
                        <th className="p-3 border-b">Material</th>
                        <th className="p-3 border-b w-40">Acción / Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {solicitudes.map((sol) => (
                        <tr key={sol.id} className="border-b hover:bg-gray-50 align-top">
                          <td className="p-3 font-mono text-sm font-bold text-blue-600">{sol.folio}</td>
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
                          <td className="p-3 text-sm whitespace-pre-wrap max-w-xs">{sol.materiales}</td>
                          <td className="p-3">
                            {/* DROPDOWN DE ESTADO */}
                            <select
                              value={sol.status}
                              onChange={(e) => handleStatusChange(sol.id, e.target.value)}
                              className={`w-full p-2 rounded-lg font-semibold text-sm border focus:ring-2 outline-none cursor-pointer
                                ${sol.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''}
                                ${sol.status === 'Entregado' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                              `}
                            >
                              <option value="Pendiente">Pendiente</option>
                              <option value="Entregado">Entregado</option>
                              <option value="Cancelado">Cancelar 🚫</option>
                            </select>
                            {sol.status === 'Entregado' && (
                              <div className="text-[10px] text-gray-400 mt-1 text-center">
                                Se borrará en 24h
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* VISTA 3: SOLICITUDES CANCELADAS */}
          {viewState === 'CANCELADAS' && (
            <div className="animate-fade-in">
              <button 
                onClick={() => setViewState('MENU')} 
                className="mb-4 text-blue-600 font-semibold hover:underline flex items-center gap-2"
              >
                ← Volver al Menú Principal
              </button>
              
              <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-red-700">Historial de Cancelaciones</h2>

              {listaCanceladas.length === 0 ? (
                <p className="text-gray-500 italic text-center py-10">No hay solicitudes canceladas registradas.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-red-50 text-red-900 uppercase text-sm">
                        <th className="p-3 border-b">Folio</th>
                        <th className="p-3 border-b">Escenario</th>
                        <th className="p-3 border-b">Solicitante</th>
                        <th className="p-3 border-b">Motivo de Cancelación</th>
                        <th className="p-3 border-b">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listaCanceladas.map((sol) => (
                        <tr key={sol.id} className="border-b hover:bg-red-50">
                          <td className="p-3 font-mono text-sm font-bold">{sol.folio}</td>
                          <td className="p-3 font-bold">{sol.escenario}</td>
                          <td className="p-3">{sol.nombre}</td>
                          <td className="p-3 text-red-600 italic bg-red-50/50 rounded-lg p-2 border border-red-100">
                            "{sol.motivoCancelacion || 'Sin motivo especificado'}"
                          </td>
                          <td className="p-3 text-xs text-gray-500">
                            {sol.fechaRegistro ? new Date(sol.fechaRegistro).toLocaleDateString() : '-'}
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
    </>
  );
};

function AuxiliarPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <div className="relative box-border flex min-h-screen items-center justify-center bg-gray-100 p-5 font-sans">
      <PageBackground />
      {isAuthenticated ? <DashboardView onLogout={() => setIsAuthenticated(false)} /> : <LoginView onLogin={() => setIsAuthenticated(true)} />}
    </div>
  );
}

export default AuxiliarPage;