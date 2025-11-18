import React from 'react';
import TareaIndividual from './TareaIndividual';

//Tareas: array de tareas
const ListaTareas = ({ tareas, onEditar, onEliminar, onCambiarEstado, usuarioId, onActualizar }) => {
  
  if (tareas.length === 0) {
    return (
      <div className="sin-tareas">
        <p>📭 No hay tareas en esta categoría</p>
      </div>
    );
  }

  //----------------------------------------------------------
  return (
    <div className="lista-tareas">
      {tareas.map(tarea => (
        <TareaIndividual
          key={tarea.id}
          tarea={tarea}
          onEditar={onEditar}
          onEliminar={onEliminar}
          onCambiarEstado={onCambiarEstado}
          usuarioId={usuarioId}
          onActualizar={onActualizar}
        />
      ))}
    </div>
  );
};

export default ListaTareas;