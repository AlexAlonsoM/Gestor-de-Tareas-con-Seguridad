import React from 'react';
import './Estilos/SwitchTema.css';

const SwitchTema = ({ temaOscuro, alternarTema }) => {
  return (
    <div className="switch-tema-container">
      <button 
        className={`switch-tema ${temaOscuro ? 'oscuro' : 'claro'}`}
        onClick={alternarTema}
        aria-label="Cambiar tema">
        <div className="switch-slider">
          <span className="icono-sol">☀️</span>
          <span className="icono-luna">🌙</span>
        </div>
      </button>
    </div>
  );
};

export default SwitchTema;