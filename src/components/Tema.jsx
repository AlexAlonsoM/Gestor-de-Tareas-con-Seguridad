import { useState, useEffect } from 'react';

export const Tema = () => {
  const [temaOscuro, setTemaOscuro] = useState(() => {
    //Recuperar preferencia guardada
    const temaGuardado = localStorage.getItem('tema');
    return temaGuardado === 'oscuro';
  });

  useEffect(() => {
    //Aplicar clase al body
    if (temaOscuro) {
      document.body.classList.add('tema-oscuro');
      localStorage.setItem('tema', 'oscuro');
    } else {
      document.body.classList.remove('tema-oscuro');
      localStorage.setItem('tema', 'claro');
    }
  }, [temaOscuro]);

  const alternarTema = () => {
    setTemaOscuro(!temaOscuro);
  };

  return { temaOscuro, alternarTema };
};