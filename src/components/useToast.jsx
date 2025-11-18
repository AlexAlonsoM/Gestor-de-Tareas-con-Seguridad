import React, { useState } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const mostrarToast = (mensaje, tipo = 'info') => {
    const id = Date.now();  //ID basada en el tiempo actual
    const nuevoToast = { id, mensaje, tipo };
    
    //Nuevo toast
    setToasts(prev => [...prev, nuevoToast]);

    //Eliminacion automatica despues de 3 segundos
    setTimeout(() => {
      cerrarToast(id);
    }, 3000);
  };

  //Cerrar/eliminar un toast especifico
  const cerrarToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return {
    toasts,
    mostrarToast,
    cerrarToast,
    exito: (mensaje) => mostrarToast(mensaje, 'exito'),
    error: (mensaje) => mostrarToast(mensaje, 'error'),
    info: (mensaje) => mostrarToast(mensaje, 'info'),
    advertencia: (mensaje) => mostrarToast(mensaje, 'advertencia')
  };
};