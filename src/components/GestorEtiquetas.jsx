import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Estilos/GestorEtiquetas.css';

const GestorEtiquetas = ({ usuarioId, tareaId, etiquetasAsignadas = [], onActualizar }) => {
  const [todasEtiquetas, setTodasEtiquetas] = useState([]);
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('');
  const [colorNueva, setColorNueva] = useState('#667eea');
  const [creandoNueva, setCreandoNueva] = useState(false);

  //Cargar todas las etiquetas disponibles
  useEffect(() => {
    cargarEtiquetas();
  }, [usuarioId]);

  //Cargar todas las etiquetas del usuario
  const cargarEtiquetas = async () => {
    try {
      const respuesta = await fetch(`http://localhost/Tareas/obtener_etiquetas.php?usuario_id=${usuarioId}`);
      const datos = await respuesta.json();
      if (datos.success) {
        setTodasEtiquetas(datos.etiquetas);
      }
    } catch (error) {
      console.error('Error al cargar etiquetas:', error);
    }
  };

  //Crear nueva etiqueta
  const crearEtiqueta = async () => {
    if (!nuevaEtiqueta.trim()) return;

    try {
      const respuesta = await fetch('http://localhost/Tareas/crear_etiqueta.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuarioId,
          nombre: nuevaEtiqueta,
          color: colorNueva
        })
      });

      const datos = await respuesta.json();
      if (datos.success) {
        await cargarEtiquetas();
        setNuevaEtiqueta('');
        setCreandoNueva(false);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  //Asignar etiqueta a tarea
  const asignarEtiqueta = async (etiquetaId) => {
    try {
      const respuesta = await fetch('http://localhost/Tareas/asignar_etiqueta.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tarea_id: tareaId,
          etiqueta_id: etiquetaId
        })
      });

      const datos = await respuesta.json();
      if (datos.success) {
        onActualizar();
        setMostrarSelector(false);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  //Quitar etiqueta de tarea
  const quitarEtiqueta = async (etiquetaId) => {
    try {
      const respuesta = await fetch('http://localhost/Tareas/quitar_etiqueta.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tarea_id: tareaId,
          etiqueta_id: etiquetaId
        })
      });

      const datos = await respuesta.json();
      if (datos.success) {
        onActualizar();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  //Etiquetas disponibles (no asignadas)
  const etiquetasDisponibles = todasEtiquetas.filter(
    et => !etiquetasAsignadas.find(ea => ea.id === et.id)
  );

  const coloresPreset = [
    '#667eea', '#3b82f6', '#10b981', '#f59e0b', 
    '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'
  ];

  //---------------------------------------------------------
  return (
    <div className="gestor-etiquetas">
      {/*Etiquetas asignadas*/}
      <div className="etiquetas-asignadas">
        {etiquetasAsignadas.map(etiqueta => (
          <div 
            key={etiqueta.id} 
            className="etiqueta-tag"
            style={{ backgroundColor: etiqueta.color }}
          >
            <span>{etiqueta.nombre}</span>
            <button className="btn-quitar-etiqueta" onClick={() => quitarEtiqueta(etiqueta.id)}>
              ×
            </button>
          </div>
        ))}

        {/*Boton añadir*/}
        <button className="btn-add-etiqueta" onClick={() => setMostrarSelector(!mostrarSelector)}>
          + Etiqueta
        </button>
      </div>

      {/*Selector de etiquetas*/}
      {mostrarSelector && createPortal(
        <div className="selector-etiquetas-overlay" onClick={() => setMostrarSelector(false)}>
          <div className="selector-etiquetas" onClick={(e) => e.stopPropagation()}>
            <div className="selector-header">
              <span>Selecciona una etiqueta</span>
              <button onClick={() => setMostrarSelector(false)}>×</button>
            </div>

            <div className="lista-etiquetas-disponibles">
              {etiquetasDisponibles.map(etiqueta => (
                <div 
                  key={etiqueta.id}
                  className="etiqueta-opcion"
                  style={{ backgroundColor: etiqueta.color }}
                  onClick={() => asignarEtiqueta(etiqueta.id)}
                >
                  {etiqueta.nombre}
                </div>
              ))}
            </div>

            {/*Crear nueva*/}
            {!creandoNueva ? (
              <button 
                className="btn-crear-nueva"
                onClick={() => setCreandoNueva(true)}
              >
                ➕ Crear nueva etiqueta
              </button>
            ) : (
              <div className="form-nueva-etiqueta">
                <input
                  type="text"
                  placeholder="Nombre de la etiqueta"
                  value={nuevaEtiqueta}
                  onChange={(e) => setNuevaEtiqueta(e.target.value)}
                  maxLength={20}
                />
                
                <div className="selector-color">
                  {coloresPreset.map(color => (
                    <div
                      key={color}
                      className={`color-opcion ${colorNueva === color ? 'activo' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setColorNueva(color)}
                    />
                  ))}
                </div>

                <div className="acciones-nueva">
                  <button onClick={crearEtiqueta} className="btn-guardar-etiqueta">
                    Crear
                  </button>
                  <button 
                    onClick={() => {
                      setCreandoNueva(false);
                      setNuevaEtiqueta('');
                    }} 
                    className="btn-cancelar-etiqueta"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default GestorEtiquetas;