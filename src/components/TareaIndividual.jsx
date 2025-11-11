import React from 'react';

//tarea: todos los datos de la tarea
//onEditar: funcion para editar la tarea
//onEliminar: funcion para eliminar la tarea  
//onCambiarEstado: funcion para cambiar el estado de la tarea
const TareaIndividual = ({ tarea, onEditar, onEliminar, onCambiarEstado }) => {
  return (
    <div className={`tarjeta-tarea prioridad-${tarea.prioridad} estado-${tarea.estado}`}>
      
      {/* HEADER */}
      <div className="tarea-header">
        <h3>{tarea.titulo}</h3>
        {/*Etiquetas para prioridad y categoria*/}
        <div className="badges">
          <span className={`badge-prioridad ${tarea.prioridad}`}>
            {tarea.prioridad.toUpperCase()}
          </span>
          <span className="badge-categoria">
            {tarea.categoria}
          </span>
        </div>
      </div>
      
      {/*DESCRIPCION de la tarea*/}
      <p className="tarea-descripcion">{tarea.descripcion}</p>
      
      {/*FOOTER (info adicional)*/}
      <div className="tarea-footer">
        {/*Informacion fecha */}
        <div className="tarea-info">  {/*Fecha de creacion formateada*/}
          <small>📅 {new Date(tarea.fecha_creacion).toLocaleDateString()}</small>
          {tarea.fecha_limite && (
            <small>⏰ Límite: {new Date(tarea.fecha_limite).toLocaleDateString()}</small>
          )}
        </div>
        
        {/*ACCIONES (para interactuar con la tarea)*/}
        <div className="tarea-acciones">
          <select value={tarea.estado}  //Valor actual del estado
          onChange={(e) => onCambiarEstado(tarea, e.target.value)}className="select-estado" //Llama a la funcion cuando cambia
          >  
            <option value="pendiente">⏳ Pendiente</option>
            <option value="en_progreso">🔄 En Progreso</option>
            <option value="completada">✅ Completada</option>
          </select>
          
          {/*EDITAR*/}
          <button onClick={() => onEditar(tarea)} className="btn-editar">✏️</button>
          
          {/*ELIMINAR*/}
          <button onClick={() => onEliminar(tarea.id)} className="btn-eliminar">🗑️</button>
        </div>
      </div>
    </div>
  );
};

export default TareaIndividual;