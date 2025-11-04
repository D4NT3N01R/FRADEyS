import "normalize.css"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SolicitudPage from '../src/Pages/SolicitudPage.jsx'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Hacemos que la ruta raíz cargue tu página de solicitud */}
        <Route path="/" element={<SolicitudPage />} />
        
        {/* Redirige cualquier otra cosa a la raíz por ahora */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;