// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SolicitudPage from './Pages/SolicitudPage';
import RoleSelectionPage from './Pages/RoleSelectionP'; // Asegúrate que termine en P
import SolicitudAlumnoPage from './Pages/SolicitudAlumnoPage';
import AuxiliarPage from './Pages/AuxiliarPage'; // IMPORTAR NUEVA PAGINA

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelectionPage />} />
        <Route path="/docente" element={<SolicitudPage />} />
        <Route path="/alumno" element={<SolicitudAlumnoPage />} />
        
        {/* NUEVA RUTA */}
        <Route path="/auxiliar" element={<AuxiliarPage />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;