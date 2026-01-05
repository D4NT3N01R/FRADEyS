// src/services/api.js

// Si existe la variable de entorno (en Vercel), úsala. Si no (en tu PC), usa localhost.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/solicitudes";

/**
 * 1. GUARDAR NUEVA SOLICITUD (POST)
 * Se usa en los formularios de Docente y Alumno.
 */
export const saveSolicitud = async (data) => {
  try {
    const newSolicitud = {
      ...data,
      status: 'Pendiente',
      fechaRegistro: new Date().toISOString()
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSolicitud),
    });

    return response.ok;
  } catch (error) {
    console.error("Error al guardar:", error);
    return false;
  }
};

/**
 * 2. OBTENER ESCENARIOS ÚNICOS
 * Revisa todas las solicitudes y extrae los nombres de salones únicos.
 */
export const getUniqueEscenarios = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    
    // Filtramos para obtener solo los nombres únicos y que no estén vacíos
    const escenarios = [...new Set(data.map(item => item.escenario))];
    
    // Filtramos nulos/vacíos y ordenamos alfabéticamente
    return escenarios.filter(Boolean).sort();
  } catch (error) {
    console.error("Error obteniendo escenarios:", error);
    return [];
  }
};

/**
 * 3. OBTENER SOLICITUDES POR ESCENARIO
 * Filtra por nombre de salón y aplica la regla de las 24 horas para entregados.
 */
export const getSolicitudesByEscenario = async (escenarioNombre) => {
  try {
    // encodeURIComponent ayuda si el nombre del salón tiene espacios
    const response = await fetch(`${API_URL}?escenario=${encodeURIComponent(escenarioNombre)}`);
    const data = await response.json();
    
    const now = new Date();

    // FILTRO VISUAL: Ocultar "Entregado" si pasaron más de 24 horas
    const filteredData = data.filter(item => {
      // Si NO está entregado, siempre se muestra (Pendientes y Cancelados)
      // Nota: El filtrado de "Cancelados" para la vista principal se hace en el componente React
      if (item.status !== 'Entregado') return true; 

      // Si está entregado, verificar fecha
      if (item.fechaEntrega) {
        const entregaDate = new Date(item.fechaEntrega);
        const hoursDiff = (now - entregaDate) / (1000 * 60 * 60);
        return hoursDiff < 24; // Solo mostrar si tiene menos de 24 horas
      }
      return true; // Si no tiene fecha de entrega por error, mostrarlo
    });

    return filteredData;
  } catch (error) {
    console.error("Error filtrando solicitudes:", error);
    return [];
  }
};

/**
 * 4. ACTUALIZAR ESTADO (PATCH)
 * Maneja cambios a 'Entregado' (guarda fecha) o 'Cancelado' (guarda motivo).
 */
export const updateStatus = async (id, newStatus, motivoCancelacion = null) => {
  try {
    const updateData = { status: newStatus };
    
    // Si se entrega, guardamos cuándo ocurrió para la regla de las 24h
    if (newStatus === 'Entregado') {
      updateData.fechaEntrega = new Date().toISOString(); 
    }
    
    // Si se cancela, guardamos el motivo
    if (newStatus === 'Cancelado' && motivoCancelacion) {
      updateData.motivoCancelacion = motivoCancelacion;
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH', // PATCH solo actualiza los campos que enviamos, no borra el resto
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });

    return response.ok;
  } catch (error) {
    console.error("Error actualizando estado:", error);
    return false;
  }
};

/**
 * 5. OBTENER SOLICITUDES CANCELADAS
 * Para el historial de cancelaciones.
 */
export const getCanceladas = async () => {
  try {
    const response = await fetch(`${API_URL}?status=Cancelado`);
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo canceladas:", error);
    return [];
  }
};

/**
 * 6. AUTENTICACIÓN SIMPLE
 * Contraseña hardcodeada para el auxiliar.
 */
export const checkAuth = (password) => {
  return password === "admin123";
};