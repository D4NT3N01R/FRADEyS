// src/components/MaterialForm/index.jsx
import React, { useState } from 'react';
import TimePicker from './TimePicker';
import MaterialList from './MaterialList';

// Definimos los datos de los materiales fuera del componente
const DATA_MATERIALES = {
  electricidad: [
    "2x Multímetro Digital",
    "4x Cables Banana-Caimán",
    "1x Fuente de Poder DC",
    "1x Protoboard",
    "5x Resistencias de 1kΩ"
  ],
  otraMateria: [
    "Material de prueba 1",
    "Material de prueba 2"
  ]
};

// --- Helper para estilos comunes ---
// Esto facilita la reutilización de clases de Tailwind
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
  // Reemplaza la manipulación del DOM
  const [nombreDocente, setNombreDocente] = useState('');
  const [fecha, setFecha] = useState('');
  const [dateError, setDateError] = useState(false);
  const [hora, setHora] = useState('');
  const [materia, setMateria] = useState('');
  const [registroCompleto, setRegistroCompleto] = useState(false);

  // --- Lógica de Visibilidad ---
  // El HTML se renderiza condicionalmente basado en el estado
  const showDate = nombreDocente.trim().length > 0;
  const showTimeAndMateria = showDate && fecha && !dateError;
  const showRegistro = showTimeAndMateria && materia;
  const isConfirmEnabled = showRegistro && registroCompleto;

  // --- Manejadores de Eventos ---

  const handleDateChange = (e) => {
    const newDateValue = e.target.value;
    setFecha(newDateValue);

    // Lógica de validación del Domingo
    const parts = newDateValue.split('-');
    const selectedDate = new Date(parts[0], parts[1] - 1, parts[2]);
    const dayOfWeek = selectedDate.getDay();

    if (dayOfWeek === 0) { // 0 es Domingo
      setDateError(true);
      setFecha(''); // Limpia la fecha inválida
    } else {
      setDateError(false);
    }
  };

  const handleMateriaChange = (e) => {
    setMateria(e.target.value);
  };

  const handleSubmit = () => {
    // Lógica de validación final (reemplaza btnConfirmar.addEventListener)
    if (!nombreDocente.trim()) return alert("Por favor, ingrese su nombre.");
    if (!fecha) return alert("Por favor, seleccione una fecha válida.");
    if (!hora) return alert("Por favor, seleccione una hora para la práctica.");
    if (!materia) return alert("Por favor, seleccione una materia.");
    if (!registroCompleto) return alert("Por favor, confirme que ha completado el registro de la práctica.");

    alert(`¡Solicitud Confirmada!\nDocente: ${nombreDocente}\nDía: ${fecha}\nHora: ${hora}`);
  };

  return (
    <>
      {/* Reemplaza .portal-body */}
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

        {/* --- Fecha (Condicional) --- */}
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

        {/* --- Hora (Condicional) --- */}
        {showTimeAndMateria && (
          <div className={formGroupStyles}>
            <label className={labelStyles}>Hora de la Práctica:</label>
            <TimePicker
              selectedTime={hora}
              onTimeSelect={(newTime) => setHora(newTime)}
            />
          </div>
        )}

        {/* --- Materia (Condicional) --- */}
        {showTimeAndMateria && (
          <div className={formGroupStyles}>
            <label htmlFor="materia" className={labelStyles}>Materia:</label>
            <select
              id="materia"
              className={commonInputStyles}
              value={materia}
              onChange={handleMateriaChange}
            >
              <option value="">[Seleccione una materia]</option>
              <option value="electricidad">[Electricidad y Magnetismo]</option>
              <option value="otraMateria">Otra Materia (Demo)</option>
            </select>
          </div>
        )}

        {/* --- Lista de Materiales (Condicional) --- */}
        {showTimeAndMateria && (
          <MaterialList materiales={DATA_MATERIALES[materia]} />
        )}

        {/* --- Registro (Condicional) --- */}
        {showRegistro && (
          <div className={formGroupStyles}>
            <label className={labelStyles}>Paso Final: Registro de Práctica</label>
            <a
              href="https://uvm.az1.qualtrics.com/jfe/form/SV_bQlNFwKPhJuJIt8"
              target="_blank"
              rel="noopener noreferrer"
              // Reemplaza #qualtrics-link
              className="box-border block w-full rounded-xl border border-black bg-white p-3.5
                         text-center text-base font-semibold text-black no-underline
                         transition hover:bg-black hover:text-white"
            >
              Ir al Registro de Práctica ↗
            </a>
            {/* Reemplaza .checkbox-wrapper */}
            <div className="mt-4 flex items-center gap-2.5">
              <input
                type="checkbox"
                id="confirmRegistro"
                // Reemplaza #confirmRegistro
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
        )}

      </form>

      {/* Reemplaza .portal-footer */}
      <footer className="px-8 pb-8">
        <button
          id="btnConfirmar"
          // Reemplaza #btnConfirmar y :disabled
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