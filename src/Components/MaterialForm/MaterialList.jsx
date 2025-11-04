// src/components/MaterialForm/MaterialList.jsx
import React from 'react';

// Este componente recibe la lista de materiales como una 'prop'
function MaterialList({ materiales }) {
  if (!materiales || materiales.length === 0) {
    return null;
  }

  return (
    // Reemplaza #seccionMateriales
    <fieldset className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-5">
      <h3 className="mb-4 mt-0 text-base font-semibold text-gray-900">
        Materiales Requeridos para la Práctica:
      </h3>
      <ul className="list-disc pl-5 text-gray-700">
        {materiales.map((item, index) => (
          <li key={index} className="mb-2 leading-snug">{item}</li>
        ))}
      </ul>
      <small className="mt-4 block italic">Nota: Esta lista es automática y no se puede editar.</small>
    </fieldset>
  );
}

export default MaterialList;