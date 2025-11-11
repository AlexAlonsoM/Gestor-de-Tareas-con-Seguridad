import React from 'react';
import TareaIndividual from './TareaIndividual';

//tareas: array de tareas
const ListaTareas = ({ tareas, onEditar, onEliminar, onCambiarEstado }) => {
  
  if (tareas.length === 0) {
    return (
      <div className="sin-tareas">
        <p>📭 No hay tareas en esta categoria</p>
      </div>
    );
  }

  //-----------------------------------------------------------------------------
  return (
    <div className="lista-tareas">
      {/*Mapea cada tarea a un componente individual (TareaIndividual)*/}
      {tareas.map(tarea => (
        <TareaIndividual
          key={tarea.id}
          tarea={tarea}
          onEditar={onEditar}
          onEliminar={onEliminar}
          onCambiarEstado={onCambiarEstado}
        />
      ))}
    </div>
  );
};

export default ListaTareas;