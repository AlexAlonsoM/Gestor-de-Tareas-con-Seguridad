import React from 'react';
import GestorEtiquetas from './GestorEtiquetas';

const TareaIndividual = ({ tarea, onEditar, onEliminar, onCambiarEstado, usuarioId, onActualizar }) => {
  return (
    <div className={`tarjeta-tarea prioridad-${tarea.prioridad} estado-${tarea.estado}`}>
      
      {/*HEADER*/}
      <div className="tarea-header">
        <h3>{tarea.titulo}</h3>
        <div className="badges">
          <span className={`badge-prioridad ${tarea.prioridad}`}>
            {tarea.prioridad.toUpperCase()}
          </span>
          <span className="badge-categoria">
            {tarea.categoria}
          </span>
        </div>
      </div>
      
      {/*DESCRIPCION*/}
      <p className="tarea-descripcion">{tarea.descripcion}</p>
      
      {/*ETIQUETAS*/}
      <GestorEtiquetas 
        usuarioId={usuarioId}
        tareaId={tarea.id}
        etiquetasAsignadas={tarea.etiquetas || []}
        onActualizar={onActualizar}
      />
      
      {/*FOOTER*/}
      <div className="tarea-footer">
        <div className="tarea-info">
          <small>📅 {new Date(tarea.fecha_creacion).toLocaleDateString()}</small>
          {tarea.fecha_limite && tarea.fecha_limite !== '0000-00-00' && (
            <small>⏰ Limite: {new Date(tarea.fecha_limite).toLocaleDateString()}</small>
          )}
        </div>
        
        <div className="tarea-acciones">
          {/*CAMBIAR ESTADO*/}
          <select 
            value={tarea.estado} 
            onChange={(e) => onCambiarEstado(tarea, e.target.value)}
            className="select-estado"
          >
            <option value="pendiente">⏳ Pendiente</option>
            <option value="en_progreso">🔄 En Progreso</option>
            <option value="completada">✅ Completada</option>
          </select>
          
          {/*EDITAR*/}
          <button onClick={() => onEditar(tarea)} className="btn-editar">
            ✏️
          </button>
          
          {/*ELIMINAR*/}
          <button onClick={() => onEliminar(tarea.id)} className="btn-eliminar">
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default TareaIndividual;