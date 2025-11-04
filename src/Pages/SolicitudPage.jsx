// src/pages/SolicitudPage.jsx
import MaterialForm from '../Components/MaterialForm/Index';
import UVMLogo from '../assets/UVMLab.Jpg';

// NOTA: Tailwind no puede manejar pseudo-elementos como body::before fácilmente.
// Ponemos la imagen de fondo en un div separado detrás del contenido.
// Asegúrate de mover 'quimicauvm.jpg' a la carpeta 'public/'
const PageBackground = () => (
  <div className="fixed inset-0 z-[-1] opacity-20 border-4 border-red-500">
    <img src={UVMLogo} alt="Background" className="w-full h-full object-cover" />
  </div>
);

function SolicitudPage() {
  return (
    // Esto reemplaza al <body>
    <div className="relative box-border flex min-h-screen items-center justify-center p-5 font-sans">
      <PageBackground />
      
      {/* Esto reemplaza al .portal-container */}
      <div className="z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-white/20 bg-white/90 shadow-lg backdrop-blur-md">
        
        {/* Header */}
        <header className="bg-black p-6 text-center text-white">
          <h1 className="text-2xl font-semibold">Solicitud Material de Laboratorio</h1>
        </header>

        {/* El formulario refactorizado */}
        <MaterialForm />

      </div>
    </div>
  );
}

export default SolicitudPage;