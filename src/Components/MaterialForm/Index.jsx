// src/Components/MaterialForm/Index.jsx
import React, { useState } from 'react';
import TimePicker from './TimePicker';
import { saveSolicitud } from '../../services/api'; 
// Asegúrate de tener estos creados como vimos en el paso anterior:
import { generateFolio } from '../../utils/folioGenerator';
import ComprobanteModal from '../ComprobanteModal';

// --- Estilos ---
const commonInputStyles = `
  w-full p-3.5 border border-gray-300 rounded-xl text-base text-gray-800 
  transition duration-200 box-border
  focus:outline-none focus:border-black focus:ring-2 focus:ring-black/30
`;
const formGroupStyles = "grid gap-2";
const labelStyles = "font-semibold text-sm text-gray-700";

function MaterialForm() {
  // --- Estados ---
  const [nombreDocente, setNombreDocente] = useState('');
  const [fecha, setFecha] = useState('');
  const [dateError, setDateError] = useState(false);
  const [escenario, setEscenario] = useState('');
  const [hora, setHora] = useState('');
  const [materia, setMateria] = useState('');
  const [materialSolicitado, setMaterialSolicitado] = useState('');
  const [registroCompleto, setRegistroCompleto] = useState(false);

  // Estado para el Ticket (Modal)
  const [ticketData, setTicketData] = useState(null);

  // --- Lógica de Visibilidad ---
  const showDate = nombreDocente.trim().length > 0;
  const showEscenario = showDate && fecha && !dateError;
  const showTimeAndMateria = showEscenario && escenario.trim().length > 0;
  const isConfirmEnabled = showTimeAndMateria && materia.trim() && hora && materialSolicitado.trim() && registroCompleto;

  // --- Manejador de Fecha ---
  const handleDateChange = (e) => {
    const newDateValue = e.target.value;
    setFecha(newDateValue);
    if (!newDateValue) return;
    
    // Validación Domingo
    const parts = newDateValue.split('-');
    const selectedDate = new Date(parts[0], parts[1] - 1, parts[2]);
    if (selectedDate.getDay() === 0) { 
      setDateError(true);
      setFecha(''); 
    } else {
      setDateError(false);
    }
  };

  // --- Enviar Solicitud ---
  const handleSubmit = async () => {
    if (!isConfirmEnabled) return alert("Faltan datos.");

    // 1. Generar Folio
    const nuevoFolio = generateFolio('DOC');

    // 2. Preparar Datos
    const solicitudData = {
      folio: nuevoFolio,
      tipo: 'Docente',
      nombre: nombreDocente,
      fechaPractica: fecha,
      hora: hora,
      materia: materia,
      escenario: escenario,
      materiales: materialSolicitado
    };

    // 3. Guardar en JSON Server
    const guardadoExitoso = await saveSolicitud(solicitudData);

    if (guardadoExitoso) {
      // 4. Mostrar Ticket
      setTicketData(solicitudData);
      
      // Limpiar formulario (opcional, visualmente se limpia cuando cierras el modal)
      setNombreDocente(''); setFecha(''); setHora(''); setMateria(''); 
      setEscenario(''); setMaterialSolicitado(''); setRegistroCompleto(false);
    } else {
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <>
      {/* --- MODAL DE TICKET --- */}
      {ticketData && (
        <ComprobanteModal 
          data={ticketData} 
          onClose={() => setTicketData(null)} 
        />
      )}

      <form className="grid gap-6 p-8" onSubmit={(e) => e.preventDefault()}>
        
        {/* Nombre */}
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

        {/* Fecha */}
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

        {/* Escenario (Texto Libre) */}
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

        {/* Resto del formulario */}
        {showTimeAndMateria && (
          <>
            <div className={formGroupStyles}>
              <label className={labelStyles}>Hora de la Práctica:</label>
              <TimePicker selectedTime={hora} onTimeSelect={setHora} />
            </div>

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
                <label htmlFor="confirmRegistro" className="cursor-pointer text-sm font-medium text-gray-700">
                  He completado el registro de la práctica.
                </label>
              </div>
            </div>
          </>
        )}

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

export default MaterialForm;