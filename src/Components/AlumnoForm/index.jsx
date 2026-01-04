// src/Components/AlumnoForm/index.jsx
import React, { useState, useEffect } from 'react';
import TimePicker from '../MaterialForm/TimePicker';
import { getEscenarios, saveSolicitud } from '../../services/mockBackend'; // Importar servicio

const commonInputStyles = `w-full p-3.5 border border-gray-300 rounded-xl text-base text-gray-800 transition duration-200 box-border focus:outline-none focus:border-black focus:ring-2 focus:ring-black/30`;
const formGroupStyles = "grid gap-2";
const labelStyles = "font-semibold text-sm text-gray-700";

function AlumnoForm() {
  const [nombre, setNombre] = useState('');
  const [matricula, setMatricula] = useState('');
  const [hora, setHora] = useState('');
  const [materialSolicitado, setMaterialSolicitado] = useState('');
  
  // --- Nuevo ---
  const [escenario, setEscenario] = useState('');
  const [listaEscenarios, setListaEscenarios] = useState([]);

  useEffect(() => {
    setListaEscenarios(getEscenarios());
  }, []);

  const handleSubmit = () => {
    if (!nombre || !matricula || !hora || !materialSolicitado || !escenario) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    // GUARDAR DATOS
    saveSolicitud({
      tipo: 'Alumno',
      nombre,
      matricula,
      hora,
      materiales: materialSolicitado, // Texto abierto
      escenario,
      fechaPractica: new Date().toLocaleDateString() // Alumno pide para hoy usualmente
    });

    alert("Solicitud de Alumno enviada al sistema.");
    // Limpiar campos...
    setNombre(''); setMatricula(''); setHora(''); setMaterialSolicitado(''); setEscenario('');
  };

  return (
    <form className="grid gap-6 p-8" onSubmit={(e) => e.preventDefault()}>
      {/* Inputs existentes de Nombre y Matricula... */}
      <div className={formGroupStyles}>
          <label className={labelStyles}>Nombre:</label>
          <input type="text" className={commonInputStyles} value={nombre} onChange={e=>setNombre(e.target.value)} />
      </div>
      <div className={formGroupStyles}>
          <label className={labelStyles}>Matrícula:</label>
          <input type="text" className={commonInputStyles} value={matricula} onChange={e=>setMatricula(e.target.value)} />
      </div>

      {/* --- NUEVO SELECTOR DE ESCENARIO --- */}
      <div className={formGroupStyles}>
        <label className={labelStyles}>Escenario a utilizar:</label>
        <select 
          className={commonInputStyles}
          value={escenario}
          onChange={(e) => setEscenario(e.target.value)}
        >
          <option value="">[Seleccione Escenario]</option>
          {listaEscenarios.map(esc => (
            <option key={esc} value={esc}>{esc}</option>
          ))}
        </select>
      </div>

      <div className={formGroupStyles}>
        <label className={labelStyles}>Hora:</label>
        <TimePicker selectedTime={hora} onTimeSelect={setHora} />
      </div>

      <div className={formGroupStyles}>
        <label className={labelStyles}>Material:</label>
        <textarea className={commonInputStyles} value={materialSolicitado} onChange={e=>setMaterialSolicitado(e.target.value)} />
      </div>

      <button onClick={handleSubmit} className="w-full bg-green-500 text-white p-4 rounded-xl font-bold mt-4">Solicitar</button>
    </form>
  );
}
export default AlumnoForm;