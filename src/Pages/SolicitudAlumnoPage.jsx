
import AlumnoForm from '../Components/AlumnoForm';
import PageBackground from '../Components/PageBackground'; // Usamos el fondo refactorizado

function SolicitudAlumnoPage() {
  return (
    <div className="relative box-border flex min-h-screen items-center justify-center  p-5 font-sans">
      <PageBackground />
      
      <div className="z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-white/20 bg-white/90 shadow-lg backdrop-blur-md">
        
        <header className="bg-black p-6 text-center text-white">
          <h1 className="text-2xl font-semibold">Solicitud de Alumno</h1>
        </header>

        <AlumnoForm />

      </div>
    </div>
  );
}

export default SolicitudAlumnoPage;