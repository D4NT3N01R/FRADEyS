// src/utils/folioGenerator.js

export const generateFolio = (prefix = 'REQ') => {
  // Genera una parte aleatoria (ej. 4 caracteres hex)
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  // Obtiene la parte de la fecha (ej. 1027 para Oct 27)
  const date = new Date();
  const datePart = `${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;

  // Resultado ej: DOC-1027-8392
  return `${prefix}-${datePart}-${randomPart}`;
};