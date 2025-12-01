// src/Components/AlumnoForm/index.jsx
import React, { useState } from 'react';
// Reutilizamos tu TimePicker existente
import TimePicker from '../MaterialForm/TimePicker'; 

// Reutilizamos los estilos de tu MaterialForm
const commonInputStyles = `
  w-full p-3.5 border border-gray-300 rounded-xl text-base text-gray-800 
  transition duration-200 box-border
  focus:outline-none focus:border-black focus:ring-2 focus:ring-black/30
`;
const formGroupStyles = "grid gap-2";
const labelStyles = "font-semibold text-sm text-gray-700";

function AlumnoForm() {
  const [nombre, setNombre] = useState('');
  const [matricula, setMatricula] = useState('');
  const [hora, setHora] = useState('');
  const [materialSolicitado, setMaterialSolicitado] = useState('');

  const isConfirmEnabled = nombre.trim() && matricula.trim() && hora && materialSolicitado.trim();

  const handleSubmit = () => {
    if (!isConfirmEnabled) {
      alert("Por favor, complete todos los campos.");
      return;
    }
    alert(`Solicitud de Alumno Confirmada:\nNombre: ${nombre}\nMatrícula: ${matricula}\nHora: ${hora}\nMaterial: ${materialSolicitado}`);
    // Limpiamos el formulario
    setNombre('');
    setMatricula('');
    setHora('');
    setMaterialSolicitado('');
  };

  return (
    <>
      <form className="grid gap-6 p-8" onSubmit={(e) => e.preventDefault()}>
        
        <div className={formGroupStyles}>
          <label htmlFor="nombreAlumno" className={labelStyles}>Nombre Completo:</label>
          <input
            type="text"
            id="nombreAlumno"
            placeholder="Escriba su nombre"
            className={commonInputStyles}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className={formGroupStyles}>
          <label htmlFor="matricula" className={labelStyles}>Matrícula Institucional:</label>
          <input
            type="text"
            id="matricula"
            placeholder="Ej. A00123456"
            className={commonInputStyles}
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
          />
        </div>

        <div className={formGroupStyles}>
          <label className={labelStyles}>Hora de la Solicitud:</label>
          <TimePicker
            selectedTime={hora}
            onTimeSelect={(newTime) => setHora(newTime)}
          />
        </div>

        <div className={formGroupStyles}>
          <label htmlFor="material" className={labelStyles}>Material a Solicitar:</label>
          <textarea
            id="material"
            rows="5"
            placeholder="Escriba el material y la cantidad..."
            className={commonInputStyles}
            value={materialSolicitado}
            onChange={(e) => setMaterialSolicitado(e.target.value)}
          />
          {/* Este es el disclaimer que pediste */}
          <small className="rounded-md bg-yellow-100 p-3 text-xs text-yellow-900 shadow-sm">
            <b>Importante:</b> Especifique la cantidad correcta (ej. "2x Multímetro") 
            y el nombre completo del material, sin abreviaciones o cosas extrañas.
          </small>
        </div>

      </form>

      <footer className="px-8 pb-8">
        <button
          className="w-full rounded-xl border-none bg-green-500 p-4 text-lg
                     font-semibold text-white transition cursor-pointer
                     hover:bg-green-600 active:scale-[.98]
                     disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
          disabled={!isConfirmEnabled}
          onClick={handleSubmit}
        >
          Confirmar y Solicitar
        </button>
      </footer>
    </>
  );
}

export default AlumnoForm;