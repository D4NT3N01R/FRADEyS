// src/Components/AlumnoForm/index.jsx
import React, { useState } from 'react';
import TimePicker from '../MaterialForm/TimePicker';
import { saveSolicitud } from '../../services/mockBackend'; 

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
  const [escenario, setEscenario] = useState(''); // Texto libre

  const handleSubmit = () => {
    if (!nombre.trim() || !matricula.trim() || !hora || !materialSolicitado.trim() || !escenario.trim()) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    // GUARDAR DATOS
    saveSolicitud({
      tipo: 'Alumno',
      nombre,
      matricula,
      hora,
      materiales: materialSolicitado, 
      escenario,
      fechaPractica: new Date().toLocaleDateString()
    });

    alert("Solicitud de Alumno enviada al sistema.");
    // Limpiar campos...
    setNombre(''); setMatricula(''); setHora(''); setMaterialSolicitado(''); setEscenario('');
  };

  return (
    <form className="grid gap-6 p-8" onSubmit={(e) => e.preventDefault()}>
      
      <div className={formGroupStyles}>
          <label className={labelStyles}>Nombre Completo:</label>
          <input 
            type="text" 
            placeholder="Escriba su nombre"
            className={commonInputStyles} 
            value={nombre} 
            onChange={e=>setNombre(e.target.value)} 
          />
      </div>

      <div className={formGroupStyles}>
          <label className={labelStyles}>Matrícula Institucional:</label>
          <input 
            type="text" 
            placeholder="Ej. A00123456"
            className={commonInputStyles} 
            value={matricula} 
            onChange={e=>setMatricula(e.target.value)} 
          />
      </div>

      {/* --- ESCENARIO (TEXTO LIBRE) --- */}
      <div className={formGroupStyles}>
        <label className={labelStyles}>Escenario a utilizar:</label>
        <input 
          type="text"
          placeholder="Escriba el salón..."
          className={commonInputStyles}
          value={escenario}
          onChange={(e) => setEscenario(e.target.value)}
        />
        <small className="text-xs text-gray-500">Ej: F203, B204, F109</small>
      </div>

      <div className={formGroupStyles}>
        <label className={labelStyles}>Hora de la Solicitud:</label>
        <TimePicker selectedTime={hora} onTimeSelect={setHora} />
      </div>

      <div className={formGroupStyles}>
        <label className={labelStyles}>Material a Solicitar:</label>
        <textarea 
          rows="5"
          placeholder="Escriba el material y la cantidad..."
          className={commonInputStyles} 
          value={materialSolicitado} 
          onChange={e=>setMaterialSolicitado(e.target.value)} 
        />
        <small className="rounded-md bg-yellow-100 p-3 text-xs text-yellow-900 shadow-sm">
          <b>Importante:</b> Especifique la cantidad correcta (ej. "2x Multímetro") 
          y el nombre completo del material, sin abreviaciones o cosas extrañas.
        </small>
      </div>

      <footer className="mt-4">
        <button 
          onClick={handleSubmit} 
          className="w-full bg-green-500 text-white p-4 rounded-xl font-bold hover:bg-green-600 transition disabled:bg-gray-300"
        >
          Solicitar
        </button>
      </footer>
    </form>
  );
}
export default AlumnoForm;