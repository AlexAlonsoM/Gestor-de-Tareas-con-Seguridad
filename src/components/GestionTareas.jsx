import React, { useState, useEffect } from 'react';
import ListaTareas from './ListaTareas';
import EditTarea from './EditTarea';
import './Estilos/GestionTareas.css';

const GestionTareas = ({ usuarioId }) => {
  const [tareas, setTareas] = useState([]);                   //Almacena todas las tareas del usuario
  const [mostrarModal, setMostrarModal] = useState(false);    //Controla si mostrar el modal
  const [tareaEditando, setTareaEditando] = useState(null);   //Tarea que se estA editando (null = nueva tarea)
  const [filtroEstado, setFiltroEstado] = useState('todas');  //Filtro para mostrar tareas (Por defecto todas)

  //CARGAR TAREAS
  useEffect(() => {
    cargarTareas();
  }, [usuarioId]);

  const cargarTareas = async () => {
    try {
      //Hacer peticion GET al servidor para obtener las tareas del usuario
      const respuesta = await fetch(`http://localhost/Tareas/obtener_tareas.php?usuario_id=${usuarioId}`);
      const datos = await respuesta.json();
      if (datos.success) {
        setTareas(datos.tareas);  //Tareas recibidas
      }
    } catch (error) {
      console.error('Error al cargar tareas:', error);
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
        cargarTareas();   //Recargar la lista
      }
    } catch (error) {
      console.error('Error:', error);
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
        cargarTareas();   //Recargar la lista
      }
    } catch (error) {
      console.error('Error:', error);
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

  //FILTRAR TAREA
  const tareasFiltradas = tareas.filter(tarea => {
    if (filtroEstado === 'todas') return true;  //Mostrar todas
    return tarea.estado === filtroEstado;       //Mostrar solo del estado seleccionado
  });

  //ESTADISTICAS
  const estadisticas = {
    total: tareas.length,
    pendientes: tareas.filter(t => t.estado === 'pendiente').length,
    en_progreso: tareas.filter(t => t.estado === 'en_progreso').length,
    completadas: tareas.filter(t => t.estado === 'completada').length
  };

  //----------------------------------------------------------------------------------------------------
  return (
    <div className="tareas-container">
      {/*ESTADISTICAS*/}
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

      {/*BARRA DE ACCIONES (Botones y filtros)*/}
      <div className="acciones-tareas">
        <button onClick={() => abrirModal()} className="btn-nueva-tarea">
          ➕ Nueva Tarea
        </button>
        
        <div className="filtros">
          <button 
            className={filtroEstado === 'todas' ? 'activo' : ''} 
            onClick={() => setFiltroEstado('todas')}>
            Todas
          </button>
          <button 
            className={filtroEstado === 'pendiente' ? 'activo' : ''} 
            onClick={() => setFiltroEstado('pendiente')}>
            Pendientes
          </button>
          <button 
            className={filtroEstado === 'en_progreso' ? 'activo' : ''} 
            onClick={() => setFiltroEstado('en_progreso')}>
            En Progreso
          </button>
          <button 
            className={filtroEstado === 'completada' ? 'activo' : ''} 
            onClick={() => setFiltroEstado('completada')}>
            Completadas
          </button>
        </div>
      </div>

      {/*LISTA DE TAREAS*/}
      <ListaTareas 
        tareas={tareasFiltradas}
        onEditar={abrirModal}
        onEliminar={eliminarTarea}
        onCambiarEstado={cambiarEstado}
      />

      {/*MODAL*/}
      {mostrarModal && (
        <EditTarea
          tarea={tareaEditando}
          usuarioId={usuarioId}
          onCerrar={cerrarModal}
          onActualizar={cargarTareas}
        />
      )}
    </div>
  );
};

export default GestionTareas;