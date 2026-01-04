// src/Components/ComprobanteModal/index.jsx
import React from 'react';
import { createPortal } from 'react-dom'; // 1. Importamos createPortal

const ComprobanteModal = ({ data, onClose }) => {
  if (!data) return null;

  // 2. Usamos createPortal para "teletransportar" el modal fuera de la tarjeta
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md animate-fade-in-up rounded-2xl bg-white p-6 shadow-2xl">
        
        {/* Encabezado del Ticket */}
        <div className="mb-4 border-b-2 border-dashed border-gray-300 pb-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800">¡Solicitud Exitosa!</h2>
          <p className="text-sm text-gray-500">Conserva este comprobante</p>
        </div>

        {/* Cuerpo del Ticket */}
        <div className="space-y-3 font-mono text-sm text-gray-700">
          <div className="flex justify-between bg-gray-100 p-2 rounded">
            <span className="font-bold">FOLIO:</span>
            <span className="font-bold text-blue-600 text-lg">{data.folio}</span>
          </div>
          
          <div className="flex justify-between border-b border-gray-100 py-1">
            <span className="font-bold">Solicitante:</span>
            <span className="text-right">{data.nombre}</span>
          </div>
          
          <div className="flex justify-between border-b border-gray-100 py-1">
            <span className="font-bold">Escenario:</span>
            <span className="text-right">{data.escenario}</span>
          </div>

          <div className="flex justify-between border-b border-gray-100 py-1">
            <span className="font-bold">Fecha/Hora:</span>
            <span className="text-right">{data.fechaPractica} - {data.hora}</span>
          </div>

          <div className="mt-2">
            <span className="font-bold block mb-1">Material Solicitado:</span>
            <div className="max-h-24 overflow-y-auto rounded border border-gray-200 bg-gray-50 p-2 text-xs whitespace-pre-wrap">
              {data.materiales}
            </div>
          </div>
        </div>

        {/* Footer con Nota y Botón */}
        <div className="mt-6 text-center">
          <p className="mb-4 text-xs italic text-red-500">
            * Por favor toma una captura de pantalla o foto de este folio para recoger tu material.
          </p>
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-black py-3 font-bold text-white transition hover:bg-gray-800 active:scale-95 cursor-pointer"
          >
            Entendido, cerrar
          </button>
        </div>

      </div>
    </div>,
    document.body // 3. Le decimos que se renderice en el body del HTML
  );
};

export default ComprobanteModal;