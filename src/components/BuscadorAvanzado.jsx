import React, { useState } from 'react';
import './Estilos/BuscadorAvanzado.css';

const BuscadorAvanzado = ({ tareas, onResultados }) => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [filtroPrioridad, setFiltroPrioridad] = useState('todas');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('reciente');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  //Obtener categorias
  const categorias = ['todas', ...new Set(tareas.map(t => t.categoria))];

  //FILTRADO
  const aplicarFiltros = () => {
    let resultado = [...tareas];

    //Busqueda por texto
    if (busqueda.trim()) {
      resultado = resultado.filter(tarea =>
        tarea.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        (tarea.descripcion && tarea.descripcion.toLowerCase().includes(busqueda.toLowerCase()))
      );
    }

    //Filtro por estado
    if (filtroEstado !== 'todas') {
      resultado = resultado.filter(tarea => tarea.estado === filtroEstado);
    }

    //Filtro por prioridad
    if (filtroPrioridad !== 'todas') {
      resultado = resultado.filter(tarea => tarea.prioridad === filtroPrioridad);
    }

    //Filtro por categoria
    if (filtroCategoria !== 'todas') {
      resultado = resultado.filter(tarea => tarea.categoria === filtroCategoria);
    }

    //Filtro por fecha 'DESE'
    if (fechaDesde) {
      resultado = resultado.filter(tarea => 
        new Date(tarea.fecha_creacion) >= new Date(fechaDesde)
      );
    }

    //Filtro por fecha 'HASTA'
    if (fechaHasta) {
      resultado = resultado.filter(tarea => 
        new Date(tarea.fecha_creacion) <= new Date(fechaHasta)
      );
    }

    //Ordenamiento
    switch (ordenamiento) {
      case 'reciente':
        resultado.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
        break;
      case 'antigua':
        resultado.sort((a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion));
        break;
      case 'prioridad':
        const prioridadOrden = { critica: 4, alta: 3, media: 2, baja: 1 };
        resultado.sort((a, b) => prioridadOrden[b.prioridad] - prioridadOrden[a.prioridad]);
        break;
      case 'alfabetico':
        resultado.sort((a, b) => a.titulo.localeCompare(b.titulo));
        break;
      default:
        break;
    }

    return resultado;
  };

  //Ejecutar filtros
  React.useEffect(() => {
    const resultados = aplicarFiltros();
    onResultados(resultados);
  }, [busqueda, filtroEstado, filtroPrioridad, filtroCategoria, fechaDesde, fechaHasta, ordenamiento, tareas]);

  //LIMPIAR FILTROS
  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroEstado('todas');
    setFiltroPrioridad('todas');
    setFiltroCategoria('todas');
    setFechaDesde('');
    setFechaHasta('');
    setOrdenamiento('reciente');
  };

  const resultados = aplicarFiltros();
  const filtrosActivos = 
    busqueda !== '' || 
    filtroEstado !== 'todas' || 
    filtroPrioridad !== 'todas' || 
    filtroCategoria !== 'todas' || 
    fechaDesde !== '' || 
    fechaHasta !== '';

  //---------------------------------------------------------------------------
  return (
    <div className="buscador-container">
      
      {/*BARRA DE BUSQUEDA*/}
      <div className="buscador-principal">
        <div className="input-busqueda">
          <span className="icono-busqueda">🔍</span>
          <input
            type="text"
            placeholder="Buscar por título o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          {busqueda && (
            <button className="btn-limpiar-input" onClick={() => setBusqueda('')}>
              ×
            </button>
          )}
        </div>

        <button className="btn-toggle-filtros" onClick={() => setMostrarFiltros(!mostrarFiltros)}>
          {mostrarFiltros ? '▲ Ocultar Filtros' : '▼ Mostrar Filtros'}
        </button>
      </div>

      {/*FILTROS AVANZADOS*/}
      {mostrarFiltros && (
        <div className="filtros-avanzados">
          
          {/*Estado, Prioridad, CategorIa */}
          <div className="filtros-fila">
            <div className="filtro-grupo">
              <label>Estado:</label>
              <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                <option value="todas">Todas</option>
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En Progreso</option>
                <option value="completada">Completada</option>
              </select>
            </div>

            <div className="filtro-grupo">
              <label>Prioridad:</label>
              <select value={filtroPrioridad} onChange={(e) => setFiltroPrioridad(e.target.value)}>
                <option value="todas">Todas</option>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>

            <div className="filtro-grupo">
              <label>Categoría:</label>
              <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'todas' ? 'Todas' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/*Fechas y Ordenamiento */}
          <div className="filtros-fila">
            <div className="filtro-grupo">
              <label>Desde:</label>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}/>
            </div>

            <div className="filtro-grupo">
              <label>Hasta:</label>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
              />
            </div>

            <div className="filtro-grupo">
              <label>Ordenar por:</label>
              <select value={ordenamiento} onChange={(e) => setOrdenamiento(e.target.value)}>
                <option value="reciente">Más recientes</option>
                <option value="antigua">Más antiguas</option>
                <option value="prioridad">Mayor prioridad</option>
                <option value="alfabetico">Alfabético</option>
              </select>
            </div>
          </div>

        </div>
      )}

      {/*RESULTADOS Y ACCIONES*/}
      <div className="buscador-footer">
        <div className="resultados-info">
          <span className="badge-resultados">
            📊 Mostrando {resultados.length} de {tareas.length} tareas
          </span>
          {filtrosActivos && (
            <span className="badge-filtros-activos">
              🔔 Filtros activos
            </span>
          )}
        </div>

        {filtrosActivos && (
          <button className="btn-limpiar-filtros" onClick={limpiarFiltros}>
            🗑️ Limpiar Filtros
          </button>
        )}
      </div>

    </div>
  );
};

export default BuscadorAvanzado;