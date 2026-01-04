// src/services/mockBackend.js

// --- CONFIGURACIÓN SIMULADA ---
const PASSWORD_AUXILIAR = "admin123"; // Contraseña del auxiliar

// Lista base de escenarios (esto vendría de tu JSON de escenarios)
const ESCENARIOS_DEFAULT = ["F203", "F204", "B403", "Laboratorio de Química", "Laboratorio de Física"];

// --- FUNCIONES ---

export const checkAuth = (password) => {
  return password === PASSWORD_AUXILIAR;
};

export const getEscenarios = () => {
  return ESCENARIOS_DEFAULT;
};

// Guarda una solicitud nueva (Docente o Alumno)
export const saveSolicitud = (data) => {
  // Obtenemos lo que ya existe o un arreglo vacío
  const currentData = JSON.parse(localStorage.getItem('solicitudes_db') || "[]");
  
  // Agregamos fecha de registro y ID
  const newData = {
    ...data,
    id: Date.now(),
    status: 'Pendiente',
    fechaRegistro: new Date().toISOString()
  };

  currentData.push(newData);
  localStorage.setItem('solicitudes_db', JSON.stringify(currentData));
  return true;
};

// Obtiene solicitudes filtradas por escenario
export const getSolicitudesByEscenario = (escenario) => {
  const allData = JSON.parse(localStorage.getItem('solicitudes_db') || "[]");
  return allData.filter(item => item.escenario === escenario);
};