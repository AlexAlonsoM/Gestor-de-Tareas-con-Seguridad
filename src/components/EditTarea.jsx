import React, { useState, useEffect } from 'react';

const EditTarea = ({ tarea, usuarioId, onCerrar, onActualizar }) => {
  
  //Formulario con valores iniciales
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'General',
    prioridad: 'media',
    fecha_limite: ''
  });

  //Efecto para ocultar el header y bloquear scroll cuando se abre el modal
  useEffect(() => {
    //Cuando se monta el modal
    document.body.style.overflow = 'hidden'; //Bloquear scroll
    const header = document.querySelector('.header-principal');
    if (header) {
      header.style.opacity = '0';             //Hacer header invisible
      header.style.pointerEvents = 'none';    //Deshabilitar clics en header
    }

    //Cuando se desmonta el modal
    return () => {
      document.body.style.overflow = 'unset'; //Restaurar scroll
      if (header) {
        header.style.opacity = '1';           //Mostrar header nuevamente
        header.style.pointerEvents = 'auto';  //Habilitar clics en header
      }
    };
  }, []);

  //Si estamos editando, cargar datos
  useEffect(() => {
    if (tarea) {
      setFormData({
        titulo: tarea.titulo,
        descripcion: tarea.descripcion,
        categoria: tarea.categoria,
        prioridad: tarea.prioridad,
        fecha_limite: tarea.fecha_limite || ''
      });
    }
  }, [tarea]);

  //Crear una nueva tarea
  const crearTarea = async () => {
    try {
      const respuesta = await fetch('http://localhost/Tareas/crear_tarea.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,  //Para incluir todos los datos del formulario
          usuario_id: usuarioId
        })
      });
      
      const datos = await respuesta.json();
      if (datos.success) {
        onActualizar();   //Actualizar lista de tareas
        onCerrar();       //Cerrar modal
      } else {
        alert('Error: ' + datos.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  //Actualizar una tarea existente
  const actualizarTarea = async () => {
    try {
      const respuesta = await fetch('http://localhost/Tareas/actualizar_tarea.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,          //Todos los datos del formulario
          id: tarea.id,
          estado: tarea.estado  //Mantener el estado actual
        })
      });
      
      const datos = await respuesta.json();
      if (datos.success) {
        onActualizar(); //Actualizar lista
        onCerrar();     //Cerrar modal
      } else {
        alert('Error: ' + datos.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  //Envio del formulario
  const manejarSubmit = (e) => {
    e.preventDefault();   //Evitar recarga de la pagina
    if (tarea) {
      actualizarTarea();  //Si hay tarea, actualizar
    } else {
      crearTarea();       //Si no hay tarea, crear nueva
    }
  };

  //---------------------------------------------------------------------------------
  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{tarea ? '✏️ Editar Tarea' : '➕ Nueva Tarea'}</h2>
        
        <form onSubmit={manejarSubmit}>
          {/*TITULO*/}
          <div className="form-group">
            <label>Titulo *</label>
            <input 
              type="text" 
              value={formData.titulo} 
              onChange={(e) => setFormData({...formData, titulo: e.target.value})}
              required
            />
          </div>
          
          {/*DESCRIPCION*/}
          <div className="form-group">
            <label>Descripción</label>
            <textarea 
              value={formData.descripcion} 
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              rows="4"
            />
          </div>
          
          {/*CATEGORIA Y PRIORIDAD*/}
          <div className="form-row">
            <div className="form-group">
              <label>Categoría</label>
              <select 
                value={formData.categoria} 
                onChange={(e) => setFormData({...formData, categoria: e.target.value})}>
                <option value="General">General</option>
                <option value="Trabajo">Trabajo</option>
                <option value="Personal">Personal</option>
                <option value="Urgente">Urgente</option>
                <option value="Seguridad">Seguridad</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Prioridad</label>
              <select 
                value={formData.prioridad} 
                onChange={(e) => setFormData({...formData, prioridad: e.target.value})}>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="critica">Critica</option>
              </select>
            </div>
          </div>
          
          {/*FECHA LIMITE*/}
          <div className="form-group">
            <label>Fecha Limite</label>
            <input 
              type="date" 
              value={formData.fecha_limite} 
              onChange={(e) => setFormData({...formData, fecha_limite: e.target.value})}
            />
          </div>
          
          {/*BOTONES*/}
          <div className="modal-acciones">
            <button type="submit" className="btn-guardar">
              {tarea ? 'Actualizar' : 'Crear'}
            </button>
            <button type="button" onClick={onCerrar} className="btn-cancelar">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTarea;