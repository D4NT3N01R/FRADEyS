// src/Components/MaterialForm/Index.jsx
import React, { useState, useEffect } from 'react';
import TimePicker from './TimePicker';
import MaterialList from './MaterialList';
// Importamos el servicio para guardar los datos y obtener escenarios
import { getEscenarios, saveSolicitud } from '../../services/mockBackend';

// Definimos los datos de los materiales
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
  
  // Nuevo estado para Escenario
  const [escenario, setEscenario] = useState('');
  const [listaEscenarios, setListaEscenarios] = useState([]);

  const [hora, setHora] = useState('');
  const [materia, setMateria] = useState('');
  
  // Estado para el checkbox de confirmación
  const [registroCompleto, setRegistroCompleto] = useState(false);

  // Cargar los escenarios al iniciar el componente
  useEffect(() => {
    setListaEscenarios(getEscenarios());
  }, []);

  // --- Lógica de Visibilidad ---
  const showDate = nombreDocente.trim().length > 0;
  
  // Ahora pedimos Escenario después de la fecha válida
  const showEscenario = showDate && fecha && !dateError;
  
  // Mostramos Hora y Materia si ya hay escenario
  const showTimeAndMateria = showEscenario && escenario;
  
  // Mostramos el registro final si ya se eligió materia y hora
  const showRegistro = showTimeAndMateria && materia && hora;
  
  // El botón se habilita solo si se marcó el checkbox
  const isConfirmEnabled = showRegistro && registroCompleto;

  // --- Manejadores de Eventos ---

  const handleDateChange = (e) => {
    const newDateValue = e.target.value;
    setFecha(newDateValue);

    // Validación de domingo
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

  const handleMateriaChange = (e) => {
    setMateria(e.target.value);
  };

  const handleSubmit = () => {
    // Validaciones finales de seguridad
    if (!nombreDocente.trim()) return alert("Por favor, ingrese su nombre.");
    if (!fecha) return alert("Por favor, seleccione una fecha válida.");
    if (!escenario) return alert("Por favor, seleccione un escenario.");
    if (!hora) return alert("Por favor, seleccione una hora para la práctica.");
    if (!materia) return alert("Por favor, seleccione una materia.");
    if (!registroCompleto) return alert("Por favor, confirme que ha completado el registro de la práctica.");

    // Guardar en nuestro "Backend" simulado
    const guardadoExitoso = saveSolicitud({
      tipo: 'Docente',
      nombre: nombreDocente,
      fechaPractica: fecha,
      hora: hora,
      materia: materia,
      escenario: escenario, // Guardamos el salón seleccionado
      materiales: DATA_MATERIALES[materia] || []
    });

    if (guardadoExitoso) {
      alert(`¡Solicitud Confirmada y Enviada al Laboratorio!\nDocente: ${nombreDocente}\nEscenario: ${escenario}\nDía: ${fecha}\nHora: ${hora}`);
      
      // Opcional: Reiniciar formulario
      // setNombreDocente(''); setFecha(''); ...
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

        {/* --- NUEVO: Selección de Escenario --- */}
        {showEscenario && (
          <div className={formGroupStyles}>
            <label htmlFor="escenario" className={labelStyles}>Escenario (Salón/Laboratorio):</label>
            <select
              id="escenario"
              className={commonInputStyles}
              value={escenario}
              onChange={(e) => setEscenario(e.target.value)}
            >
              <option value="">[Seleccione un escenario]</option>
              {listaEscenarios.map((esc) => (
                <option key={esc} value={esc}>{esc}</option>
              ))}
            </select>
          </div>
        )}

        {/* --- Hora --- */}
        {showTimeAndMateria && (
          <div className={formGroupStyles}>
            <label className={labelStyles}>Hora de la Práctica:</label>
            <TimePicker
              selectedTime={hora}
              onTimeSelect={(newTime) => setHora(newTime)}
            />
          </div>
        )}

        {/* --- Materia --- */}
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

        {/* --- Lista de Materiales --- */}
        {showTimeAndMateria && (
          <MaterialList materiales={DATA_MATERIALES[materia]} />
        )}

        {/* --- Registro (Restaurado) --- */}
        {showRegistro && (
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
        )}

      </form>

      {/* --- Footer --- */}
      <footer className="px-8 pb-8">
        <button
          id="btnConfirmar"
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