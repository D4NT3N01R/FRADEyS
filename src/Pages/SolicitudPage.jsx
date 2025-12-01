// src/Pages/SolicitudPage.jsx
import MaterialForm from '../Components/MaterialForm';
import PageBackground from '../Components/PageBackground'; // <-- 1. IMPORTARLO

// 2. ELIMINAR ESTA DEFINICIÓN de const PageBackground
/*
const PageBackground = () => (
  <div
    className="fixed inset-0 z-[-1] bg-cover bg-center opacity-20"
    style={{ backgroundImage: "url('/UVMLab.jpg')" }} 
  />
);
*/

function SolicitudPage() {
  return (
    <div className="relative box-border flex min-h-screen items-center justify-center  p-5 font-sans">
      <PageBackground /> {/* <-- 3. Sigue funcionando igual */}
      
      <div className="z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-white/20 bg-white/90 shadow-lg backdrop-blur-md">
        
        <header className="bg-black p-6 text-center text-white">
          <h1 className="text-2xl font-semibold">Solicitud Material de Laboratorio</h1>
        </header>

        <MaterialForm />

      </div>
    </div>
  );
}

export default SolicitudPage;