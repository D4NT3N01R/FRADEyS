// src/Pages/RoleSelectionP.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import PageBackground from '../Components/PageBackground';
import UvmLogo from '../assets/UVM.png';

const selectionBoxStyle = `
  flex h-40 w-full cursor-pointer items-center justify-center 
  rounded-2xl border border-gray-300 bg-white/80 
  text-center text-xl font-semibold text-gray-800
  shadow-md transition-all duration-300
  hover:scale-105 hover:border-black hover:bg-white
  focus:outline-none focus:ring-2 focus:ring-black/50
`;

function RoleSelectionPage() {
  return (
    <div className="relative box-border flex min-h-screen items-center justify-center bg-gray-100 p-5 font-sans">
      <PageBackground />
      
      <div className="z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-white/90 shadow-lg backdrop-blur-md">
        
        <header className="bg-black p-6 text-center text-white">
          <img src={UvmLogo} alt="Logo UVM" className="mx-auto mb-4 h-16 w-auto" />
          <h1 className="text-2xl font-semibold">Bienvenido al Laboratorio</h1>
        </header>

        {/* Grid ajustado para 3 opciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
          <Link to="/docente" className={selectionBoxStyle}>
            Soy Docente
          </Link>
          
          <Link to="/alumno" className={selectionBoxStyle}>
            Soy Alumno
          </Link>

          <Link to="/auxiliar" className={selectionBoxStyle}>
            Auxiliar / Laboratorista
          </Link>
        </div>
        
        <footer className="p-4 text-center text-sm text-gray-600">
          Seleccione su rol para continuar
        </footer>

      </div>
    </div>
  );
}

export default RoleSelectionPage;