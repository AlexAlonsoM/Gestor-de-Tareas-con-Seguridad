import React, { useState, useEffect, useRef } from 'react';
import './Estilos/Notificaciones.css';

const Notificaciones = ({ tareas }) => {
    //Cntrolar si el panel de notificaciones esta visible o no
    const [mostrarPanel, setMostrarPanel] = useState(false);
    const panelRef = useRef(null);  //etectar clics fuera

    //Cerrar panel al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (panelRef.current && !panelRef.current.contains(event.target)) {
         setMostrarPanel(false);
        }
    };

    //Solo agregar si el panel esta visible
    if (mostrarPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
}, [mostrarPanel]);

  //CALCULAR NOTIFICACIONES
  const obtenerNotificaciones = () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const notificaciones = [];

    tareas.forEach(tarea => {
      //Solo tareas no completadas
      if (tarea.estado === 'completada') return;

      //Tareas criticas pendientes
      if (tarea.prioridad === 'critica') {
        notificaciones.push({
          id: `critica-${tarea.id}`,
          tipo: 'critica',
          titulo: '🔥 Tarea critica pendiente',
          descripcion: tarea.titulo,
          prioridad: 'alta'
        });
      }

      //Tareas con fecha limite
      if (tarea.fecha_limite && tarea.fecha_limite !== '0000-00-00') {
        const fechaLimite = new Date(tarea.fecha_limite);
        fechaLimite.setHours(0, 0, 0, 0);

        const diffDias = Math.ceil((fechaLimite - hoy) / (1000 * 60 * 60 * 24));

        //Tareas vencidas
        if (diffDias < 0) {
          notificaciones.push({
            id: `vencida-${tarea.id}`,
            tipo: 'vencida',
            titulo: '⚠️ Tarea vencida',
            descripcion: `${tarea.titulo} (vencio hace ${Math.abs(diffDias)} dias)`,
            prioridad: 'alta'
          });
        }
        //Tareas que vencen HOY
        else if (diffDias === 0) {
          notificaciones.push({
            id: `hoy-${tarea.id}`,
            tipo: 'hoy',
            titulo: '🔔 Vence HOY',
            descripcion: tarea.titulo,
            prioridad: 'alta'
          });
        }
        //Tareas que vencen en 1-3 dias
        else if (diffDias <= 3) {
          notificaciones.push({
            id: `proxima-${tarea.id}`,
            tipo: 'proxima',
            titulo: `⏰ Vence en ${diffDias} dia${diffDias > 1 ? 's' : ''}`,
            descripcion: tarea.titulo,
            prioridad: 'media'
          });
        }
      }
    });

    //Ordenar por prioridad
    const ordenPrioridad = { alta: 3, media: 2, baja: 1 };
    notificaciones.sort((a, b) => ordenPrioridad[b.prioridad] - ordenPrioridad[a.prioridad]);

    return notificaciones;
  };

  const notificaciones = obtenerNotificaciones();
  const hayNotificaciones = notificaciones.length > 0;

  //------------------------------------------------------------------------------------
  return (
    <div className="notificaciones-container" ref={panelRef}>
      
      {/*BOTON CAMPANA*/}
      <button 
        className={`btn-notificaciones ${hayNotificaciones ? 'tiene-notificaciones' : ''}`}
        onClick={() => setMostrarPanel(!mostrarPanel)}>
        🔔
        {hayNotificaciones && (
          <span className="badge-contador">{notificaciones.length}</span>
        )}
      </button>

      {/*PANEL DE NOTIFICACIONES*/}
      {mostrarPanel && (
        <div className="panel-notificaciones">
          <div className="panel-header">
            <h3>🔔 Notificaciones</h3>
            <span className="contador-header">{notificaciones.length}</span>
          </div>

          <div className="panel-contenido">
            {notificaciones.length === 0 ? (
              <div className="sin-notificaciones">
                <p>✅ No tienes notificaciones</p>
                <span>Todo esta al dia</span>
              </div>
            ) : (
              notificaciones.map(notif => (
                <div key={notif.id} className={`notificacion-item prioridad-${notif.prioridad}`}>
                  <div className="notif-icono">
                    {notif.tipo === 'critica' && '🔥'}
                    {notif.tipo === 'vencida' && '⚠️'}
                    {notif.tipo === 'hoy' && '🔔'}
                    {notif.tipo === 'proxima' && '⏰'}
                  </div>
                  <div className="notif-contenido">
                    <div className="notif-titulo">{notif.titulo}</div>
                    <div className="notif-descripcion">{notif.descripcion}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notificaciones.length > 0 && (
            <div className="panel-footer">
              <button className="btn-cerrar-panel"onClick={() => setMostrarPanel(false)}>
                Cerrar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notificaciones;