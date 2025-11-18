import React, { useEffect } from 'react';
import './Estilos/Toast.css';

const Toast = ({ mensaje, tipo, onClose, duracion = 3000 }) => {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duracion);

    return () => clearTimeout(timer);
  }, [duracion, onClose]);

  //Iconos segun tipo
  const iconos = {
    exito: '✅',
    error: '❌',
    info: 'ℹ️',
    advertencia: '⚠️'
  };

  //-----------------------------------------------------------------
  return (
    <div className={`toast toast-${tipo}`}>
      <div className="toast-icono">
        {iconos[tipo] || 'ℹ️'}
      </div>
      <div className="toast-mensaje">
        {mensaje}
      </div>
      <button className="toast-cerrar" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default Toast;