// src/Components/MaterialForm/Index.jsx
import React, { useState } from 'react';
import TimePicker from './TimePicker';
import { saveSolicitud } from '../../services/mockBackend';

// --- Helper para estilos comunes ---
const commonInputStyles = `
  w-full p-3.5 border border-gray-300 rounded-xl text-base text-gray-800 
  transition duration-200 box-border
  focus:outline-none focus:border-black focus:ring-2 focus:ring-black/30
`;
const formGroupStyles = "grid gap-2";
const labelStyles = "font-semibold text-sm text-gray-700";
// ---

function MaterialForm() {
  // --- Estado de React ---
  const [nombreDocente, setNombreDocente] = useState('');
  const [fecha, setFecha] = useState('');
  const [dateError, setDateError] = useState(false);
  
  // Datos ahora de entrada libre
  const [escenario, setEscenario] = useState('');
  const [hora, setHora] = useState('');
  const [materia, setMateria] = useState('');
  const [materialSolicitado, setMaterialSolicitado] = useState(''); // Nuevo estado para el material texto
  
  // Estado para el checkbox de confirmación
  const [registroCompleto, setRegistroCompleto] = useState(false);

  // --- Lógica de Visibilidad ---
  const showDate = nombreDocente.trim().length > 0;
  
  // Mostramos Escenario después de la fecha válida
  const showEscenario = showDate && fecha && !dateError;
  
  // Mostramos Hora, Materia y Material si ya hay escenario escrito
  // (Verificamos que escenario no esté vacío)
  const showTimeAndMateria = showEscenario && escenario.trim().length > 0;
  
  // El botón se habilita si todo está lleno
  const isConfirmEnabled = showTimeAndMateria && materia.trim() && hora && materialSolicitado.trim() && registroCompleto;

  // --- Manejadores de Eventos ---

  const handleDateChange = (e) => {
    const newDateValue = e.target.value;
    setFecha(newDateValue);

    // Validación de domingo
    if (!newDateValue) return;
    const parts = newDateValue.split('-');
    const selectedDate = new Date(parts[0], parts[1] - 1, parts[2]);
    const dayOfWeek = selectedDate.getDay();

    if (dayOfWeek === 0) { 
      setDateError(true);
      setFecha(''); 
    } else {
      setDateError(false);
    }
  };

  const handleSubmit = () => {
    // Validaciones finales
    if (!nombreDocente.trim()) return alert("Por favor, ingrese su nombre.");
    if (!fecha) return alert("Por favor, seleccione una fecha válida.");
    if (!escenario.trim()) return alert("Por favor, escriba un escenario.");
    if (!hora) return alert("Por favor, seleccione una hora.");
    if (!materia.trim()) return alert("Por favor, escriba la materia.");
    if (!materialSolicitado.trim()) return alert("Por favor, liste los materiales.");
    if (!registroCompleto) return alert("Confirme el registro de práctica.");

    // Guardar solicitud
    const guardadoExitoso = saveSolicitud({
      tipo: 'Docente',
      nombre: nombreDocente,
      fechaPractica: fecha,
      hora: hora,
      materia: materia, // Ahora es texto libre
      escenario: escenario, // Ahora es texto libre
      materiales: materialSolicitado // Ahora es texto libre
    });

    if (guardadoExitoso) {
      alert(`¡Solicitud Confirmada!\nDocente: ${nombreDocente}\nMateria: ${materia}\nEscenario: ${escenario}`);
      // Opcional: limpiar campos aquí
    }
  };

  return (
    <>
      <form className="grid gap-6 p-8" onSubmit={(e) => e.preventDefault()}>
        
        {/* --- Nombre Docente --- */}
        <div className={formGroupStyles}>
          <label htmlFor="nombreDocente" className={labelStyles}>Nombre del Docente:</label>
          <input
            type="text"
            id="nombreDocente"
            placeholder="Escriba su nombre completo"
            className={commonInputStyles}
            value={nombreDocente}
            onChange={(e) => setNombreDocente(e.target.value)}
          />
        </div>

        {/* --- Fecha --- */}
        {showDate && (
          <div className={formGroupStyles}>
            <label htmlFor="fechaPractica" className={labelStyles}>Fecha de la Práctica:</label>
            <input
              type="date"
              id="fechaPractica"
              className={commonInputStyles}
              value={fecha}
              onChange={handleDateChange}
            />
            {dateError && (
              <div className="text-sm font-semibold text-red-600">
                No hay prácticas realizadas en domingo.
              </div>
            )}
          </div>
        )}

        {/* --- Escenario (Texto Libre) --- */}
        {showEscenario && (
          <div className={formGroupStyles}>
            <label htmlFor="escenario" className={labelStyles}>Escenario (Salón/Laboratorio):</label>
            <input
              type="text"
              id="escenario"
              placeholder="Escriba el salón..."
              className={commonInputStyles}
              value={escenario}
              onChange={(e) => setEscenario(e.target.value)}
            />
            <small className="text-xs text-gray-500">Ej: F203, B204, F109</small>
          </div>
        )}

        {/* --- Hora, Materia y Materiales --- */}
        {showTimeAndMateria && (
          <>
            <div className={formGroupStyles}>
              <label className={labelStyles}>Hora de la Práctica:</label>
              <TimePicker
                selectedTime={hora}
                onTimeSelect={(newTime) => setHora(newTime)}
              />
            </div>

            {/* Materia Texto Libre */}
            <div className={formGroupStyles}>
              <label htmlFor="materia" className={labelStyles}>Materia:</label>
              <input
                type="text"
                id="materia"
                placeholder="Nombre de la asignatura"
                className={commonInputStyles}
                value={materia}
                onChange={(e) => setMateria(e.target.value)}
              />
              <small className="text-xs text-red-600 font-medium">
                Nombre completo de la asignatura sin ABREVIACIONES
              </small>
            </div>

            {/* Material Texto Libre (Textarea) */}
            <div className={formGroupStyles}>
              <label htmlFor="materiales" className={labelStyles}>Lista de Materiales:</label>
              <textarea
                id="materiales"
                rows="5"
                placeholder="Escriba el material y la cantidad..."
                className={commonInputStyles}
                value={materialSolicitado}
                onChange={(e) => setMaterialSolicitado(e.target.value)}
              />
              <small className="rounded-md bg-yellow-100 p-3 text-xs text-yellow-900 shadow-sm">
                <b>Importante:</b> Especifique la cantidad correcta (ej. "2x Multímetro") 
                y el nombre completo del material, sin abreviaciones o cosas extrañas.
              </small>
            </div>

            {/* --- Registro Qualtrics --- */}
            <div className={formGroupStyles}>
              <label className={labelStyles}>Paso Final: Registro de Práctica</label>
              
              <a
                href="https://uvm.az1.qualtrics.com/jfe/form/SV_bQlNFwKPhJuJIt8"
                target="_blank"
                rel="noopener noreferrer"
                className="box-border block w-full rounded-xl border border-black bg-white p-3.5
                           text-center text-base font-semibold text-black no-underline
                           transition hover:bg-black hover:text-white"
              >
                Ir al Registro de Práctica ↗
              </a>

              <div className="mt-4 flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="confirmRegistro"
                  className="h-4 w-4 cursor-pointer"
                  checked={registroCompleto}
                  onChange={(e) => setRegistroCompleto(e.target.checked)}
                />
                <label
                  htmlFor="confirmRegistro"
                  className="cursor-pointer text-sm font-medium text-gray-700"
                >
                  He completado el registro de la práctica.
                </label>
              </div>
            </div>
          </>
        )}

      </form>

      {/* --- Footer --- */}
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

export default MaterialForm;