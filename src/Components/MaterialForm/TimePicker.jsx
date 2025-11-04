// src/components/MaterialForm/TimePicker.jsx
import React, { useMemo } from 'react';

// Genera las horas una sola vez
function generateTimes() {
  const times = [];
  const horaInicio = 7;
  const horaFin = 21;
  for (let h = horaInicio; h <= horaFin; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === horaFin && m > 0) break;
      const timeValue = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      times.push(timeValue);
    }
  }
  return times;
}

function TimePicker({ selectedTime, onTimeSelect }) {
  // useMemo evita que se regenere la lista de horas en cada render
  const timeSlots = useMemo(() => generateTimes(), []);

  return (
    // Reemplaza .picker-container
    <div className="overflow-x-auto whitespace-nowrap py-2 scrollbar-hide">
      {/* Reemplaza .picker-items */}
      <div className="flex gap-2.5">
        {timeSlots.map((time) => {
          // Verifica si este chip es el seleccionado
          const isSelected = time === selectedTime;
          
          return (
            <button
              key={time}
              type="button"
              // Reemplaza .time-chip y .time-chip.selected
              className={`
                flex-shrink-0 cursor-pointer rounded-full border px-4 py-2.5 text-sm
                font-medium transition 
                ${isSelected
                  ? 'border-black bg-black font-semibold text-white'
                  : 'border-gray-300 bg-gray-50 text-gray-800 hover:bg-gray-200'
                }
              `}
              onClick={() => onTimeSelect(time)}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TimePicker;