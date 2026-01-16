// src/services/api.jsx

// CONFIGURACIÓN DE URL DINÁMICA
// 1. En Vercel: Usará la variable de entorno que configuraste (MockAPI).
// 2. En Local: Usará http://localhost:3000 si no existe la variable.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Nos aseguramos de apuntar al recurso "solicitudes"
// Si se usaste la URL base de MockAPI (ej. .../api/v1), esto le agrega /solicitudes
const API_URL = `${BASE_URL}/solicitudes`;

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
    
    // Si la API no devuelve un array (error), retornamos vacío
    if (!Array.isArray(data)) return [];

    // Filtramos para obtener solo los nombres únicos y eliminamos vacíos
    const escenarios = [...new Set(data.map(item => item.escenario))];
    
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
    // MockAPI permite filtrar directamente en la URL con ?campo=valor
    const response = await fetch(`${API_URL}?escenario=${encodeURIComponent(escenarioNombre)}`);
    const data = await response.json();
    
    // Validación de seguridad por si MockAPI devuelve error
    if (!Array.isArray(data)) return [];

    const now = new Date();

    // FILTRO VISUAL: Ocultar "Entregado" si pasaron más de 24 horas
    const filteredData = data.filter(item => {
      // Si NO está entregado, siempre se muestra (Pendientes, Cancelados, etc.)
      if (item.status !== 'Entregado') return true; 

      // Si está entregado, verificar fecha
      if (item.fechaEntrega) {
        const entregaDate = new Date(item.fechaEntrega);
        const hoursDiff = (now - entregaDate) / (1000 * 60 * 60);
        return hoursDiff < 24; // Solo mostrar si tiene menos de 24 horas
      }
      return true; 
    });

    return filteredData;
  } catch (error) {
    console.error("Error filtrando solicitudes:", error);
    return [];
  }
};

/**
 * 4. ACTUALIZAR ESTADO (PUT)
 * Maneja cambios a 'Entregado' (guarda fecha) o 'Cancelado' (guarda motivo).
 */
export const updateStatus = async (id, newStatus, motivoCancelacion = null) => {
  try {
    // 1. Primero obtenemos el objeto actual para no perder datos al hacer PUT
    const currentResponse = await fetch(`${API_URL}/${id}`);
    const currentData = await currentResponse.json();

    // 2. Preparamos los datos actualizados
    const updateData = { 
      ...currentData, // Mantenemos los datos viejos (nombre, material, etc.)
      status: newStatus 
    };
    
    // Si se entrega, guardamos la fecha
    if (newStatus === 'Entregado') {
      updateData.fechaEntrega = new Date().toISOString(); 
    }
    
    // Si se cancela, guardamos el motivo
    if (newStatus === 'Cancelado' && motivoCancelacion) {
      updateData.motivoCancelacion = motivoCancelacion;
    }

    // 3. Enviamos la actualización completa (PUT es más seguro en MockAPI que PATCH)
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
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
    const data = await response.json();
    return Array.isArray(data) ? data : [];
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