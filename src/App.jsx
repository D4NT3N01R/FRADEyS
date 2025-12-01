import "normalize.css"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SolicitudPage from './Pages/SolicitudPage'; // Esta es ahora /docente
import RoleSelectionPage from './Pages/RoleSelectionP'; // Nueva página principal
import SolicitudAlumnoPage from './Pages/SolicitudAlumnoPage'; // Nueva página de alumno

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Raíz: Muestra la selección de rol */}
        <Route path="/" element={<RoleSelectionPage />} />
        
        {/* Ruta Docente: Muestra el formulario original */}
        <Route path="/docente" element={<SolicitudPage />} />
        
        {/* Ruta Alumno: Muestra el nuevo formulario de alumno */}
        <Route path="/alumno" element={<SolicitudAlumnoPage />} />
        
        {/* Redirige cualquier otra cosa a la selección de rol */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;