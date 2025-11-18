import React, { useState, useEffect } from 'react';
import ListaTareas from './ListaTareas';
import EditTarea from './EditTarea';
import BuscadorAvanzado from './BuscadorAvanzado';
import CargadorEsqueleto from './CargadorEsqueleto';
import Toast from './Toast';
import { useToast } from './useToast';
import './Estilos/GestionTareas.css';

const GestionTareas = ({ usuarioId }) => {
  const [tareas, setTareas] = useState([]);                               //Almacena todas las tareas del usuario
  const [tareasFiltradas, setTareasFiltradas] = useState([]);             //Almacena las tareas despues de aplicar filtros del buscador
  const [mostrarModal, setMostrarModal] = useState(false);                //Controla si mostrar el modal
  const [tareaEditando, setTareaEditando] = useState(null);               //Tarea que se esta editando (null = nueva tarea)
  const [cargando, setCargando] = useState(true);                         //Estado de carga
  const { toasts, cerrarToast, exito, error, advertencia } = useToast();  //Mostrar notificaciones

  //CARGAR TAREAS
  useEffect(() => {
    cargarTareas();
  }, [usuarioId]);

  const cargarTareas = async () => {
    setCargando(true);  //Activar carga
    try {
      //Hacer peticion GET al servidor para obtener las tareas del usuario
      const respuesta = await fetch(`http://localhost/Tareas/obtener_tareas.php?usuario_id=${usuarioId}`);
      const datos = await respuesta.json();
      if (datos.success) {
        setTareas(datos.tareas);            //Tareas recibidas
        setTareasFiltradas(datos.tareas);   //Inicializar tareas filtradas
      }
    } catch (err) {
      error('Error al cargar las tareas');  //Toast de error
      console.error('Error al cargar tareas:', err);
    } finally {
      setCargando(false);  //Desactivar carga
    }
  };

  //ELIMINAR TAREAS
  const eliminarTarea = async (id) => {
    //Confirmacion
    if (!window.confirm('¿Estas seguro de eliminar esta tarea?')) return;
    
    try {
      //DELETE para eliminar la tarea
      const respuesta = await fetch('http://localhost/Tareas/eliminar_tarea.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: id,
          usuario_id: usuarioId  //Incluir ID del usuario por seguridad
        })
      });
      
      const datos = await respuesta.json();
      if (datos.success) {
        error('🗑️ Tarea eliminada');;  //Toast exito
        cargarTareas();   //Recargar la lista
      } else {
        error('❌ Error al eliminar la tarea');  //Toast error
      }
    } catch (err) {
      error('❌ Error de conexión');  //Toast error
      console.error('Error:', err);
    }
  };

  //CAMBIAR ESTADO
  const cambiarEstado = async (tarea, nuevoEstado) => {
    try {
      const respuesta = await fetch('http://localhost/Tareas/actualizar_tarea.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: tarea.id,
          titulo: tarea.titulo,
          descripcion: tarea.descripcion,
          categoria: tarea.categoria,
          prioridad: tarea.prioridad,
          estado: nuevoEstado,    //Nuevo estado seleccionado
          fecha_limite: tarea.fecha_limite
        })
      });
      
      const datos = await respuesta.json();
      if (datos.success) {
        if (nuevoEstado === 'completada') {
          exito('🎉 ¡Tarea completada!');  //Toast especial para completadas
        } else {
          exito('✅ Estado actualizado');  //Toast exito
        }
        cargarTareas();   //Recargar la lista
      } else {
        error('❌ Error al actualizar estado');  //Toast error
      }
    } catch (err) {
      error('❌ Error de conexión');  //Toast error
      console.error('Error:', err);
    }
  };

  //MODAL (Al crear o editar una tarea)
  const abrirModal = (tarea = null) => {
    setTareaEditando(tarea);    //Si tarea es null, se crea nueva
    setMostrarModal(true);      //Mostrar el modal
  };

  //Cerrar el modal y limpia la tarea
  const cerrarModal = () => {
    setMostrarModal(false);
    setTareaEditando(null);
  };

  //RECIBIR TAREAS FILTRADAS DEL BUSCADOR
  const manejarResultados = (resultados) => {
    setTareasFiltradas(resultados);  //Actualizar tareas filtradas
  };

  //ESTADISTICAS
  const estadisticas = {
    total: tareas.length,
    pendientes: tareas.filter(t => t.estado === 'pendiente').length,
    en_progreso: tareas.filter(t => t.estado === 'en_progreso').length,
    completadas: tareas.filter(t => t.estado === 'completada').length
  };

  //----------------------------------------------------------------------------------------------------
  return (
    <div>
      {/*NOTIFICACIONES TOAST*/}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          mensaje={toast.mensaje}
          tipo={toast.tipo}
          onClose={() => cerrarToast(toast.id)}
        />
      ))}

      <div className="tareas-container">
        {/*ESTADISTICAS*/}
        {cargando ? (
          <CargadorEsqueleto tipo="estadistica" cantidad={4} />
        ) : (
          <div className="estadisticas-tareas">
            <div className="stat-card total">
              <h3>{estadisticas.total}</h3>
              <p>Total</p>
            </div>
            <div className="stat-card pendientes">
              <h3>{estadisticas.pendientes}</h3>
              <p>Pendientes</p>
            </div>
            <div className="stat-card progreso">
              <h3>{estadisticas.en_progreso}</h3>
              <p>En Progreso</p>
            </div>
            <div className="stat-card completadas">
              <h3>{estadisticas.completadas}</h3>
              <p>Completadas</p>
            </div>
          </div>
        )}

        {/*BOTON NUEVA TAREA*/}
        <div className="acciones-tareas">
          <button onClick={() => abrirModal()} className="btn-nueva-tarea">
            ➕ Nueva Tarea
          </button>
        </div>

        {/*BUSCADOR AVANZADO (Busqueda por texto + filtros multiples + ordenamiento)*/}
        {!cargando && <BuscadorAvanzado tareas={tareas} onResultados={manejarResultados} />}

        {/*LISTA DE TAREAS (Muestra las tareas filtradas)*/}
        {cargando ? (
          <CargadorEsqueleto tipo="tarea" cantidad={3} />
        ) : (
          <ListaTareas 
            tareas={tareasFiltradas}
            onEditar={abrirModal}
            onEliminar={eliminarTarea}
            onCambiarEstado={cambiarEstado}
            usuarioId={usuarioId}
            onActualizar={cargarTareas}
          />
        )}

        {/*MODAL*/}
        {mostrarModal && (
          <EditTarea
            tarea={tareaEditando}
            usuarioId={usuarioId}
            onCerrar={cerrarModal}
            onActualizar={() => {
              cargarTareas();
              if (tareaEditando) {
                advertencia('✏️ Tarea actualizada');
              } else {
                exito('✅ Tarea creada');
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default GestionTareas;