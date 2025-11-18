import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';  //Libreria para crear graficos
import './Estilos/Dashboard.css';
import GrafoRelaciones from './GrafoRelaciones';
import EstadisticasAvanzadas from './EstadisticasAvanzadas';
import DashboardSeguridad from './DashboardSeguridad';

const Dashboard = ({ usuarioId }) => {
  const [tareas, setTareas] = useState([]);   //Almacenar todas las tareas del usuario
  const [seccionActiva, setSeccionActiva] = useState('graficos');   //Controlar la seccion que se muestra

  //Cargar tareas
  useEffect(() => {
    cargarTareas();
  }, [usuarioId]);

  const cargarTareas = async () => {
    try {
      const respuesta = await fetch(`http://localhost/Tareas/obtener_tareas.php?usuario_id=${usuarioId}`);
      const datos = await respuesta.json();
      if (datos.success) {
        setTareas(datos.tareas);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  //DATOS PARA GRAFICOS  
  //Grafico de Barras
  const datosPorCategoria = () => {
    const categorias = {};
    tareas.forEach(tarea => {
      const cat = tarea.categoria || 'General';
      categorias[cat] = (categorias[cat] || 0) + 1;
    });
    return Object.keys(categorias).map(cat => ({
      categoria: cat,
      cantidad: categorias[cat]
    }));
  };

  //Grafico Circular
  const datosPorEstado = () => {
    const estados = {
      pendiente: { nombre: 'Pendientes', cantidad: 0, color: '#f59e0b' },
      en_progreso: { nombre: 'En Progreso', cantidad: 0, color: '#4facfe' },
      completada: { nombre: 'Completadas', cantidad: 0, color: '#10b981' }
    };

    tareas.forEach(tarea => {
      if (estados[tarea.estado]) {
        estados[tarea.estado].cantidad++;
      }
    });

    return Object.values(estados).map(e => ({
      name: e.nombre,
      value: e.cantidad,
      color: e.color
    }));
  };

  //Grafico de Lineas
  const datosPorFecha = () => {
    const fechas = {};
    tareas.forEach(tarea => {
      const fecha = new Date(tarea.fecha_creacion).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short'
      });
      fechas[fecha] = (fechas[fecha] || 0) + 1;
    });

    return Object.keys(fechas).map(fecha => ({
      fecha,
      tareas: fechas[fecha]
    }));
  };

  //Estadisticas generales
  const estadisticas = {
    total: tareas.length,
    pendientes: tareas.filter(t => t.estado === 'pendiente').length,
    en_progreso: tareas.filter(t => t.estado === 'en_progreso').length,
    completadas: tareas.filter(t => t.estado === 'completada').length,
    criticas: tareas.filter(t => t.prioridad === 'critica').length
  };

  //Calcular porcentaje de tareas completadas
  const porcentajeCompletado = tareas.length > 0 ? Math.round((estadisticas.completadas / tareas.length) * 100) : 0;


  //----------------------------------------------------
  return (
    <div className="dashboard-container">
      {/*HEADER*/}
      <div className="dashboard-header">
        <h1>Dashboard Analytics</h1>
        <p>Analisis completo de tus tareas</p>
      </div>

      {/*CARDS DE ESTADISTICAS*/}
      <div className="stats-cards">
        <div className="stat-card-dash total">
          <div className="stat-icon">📌</div>
          <div className="stat-info">
            <h3>{estadisticas.total}</h3>
            <p>Total Tareas</p>
          </div>
        </div>

        <div className="stat-card-dash pendientes">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{estadisticas.pendientes}</h3>
            <p>Pendientes</p>
          </div>
        </div>

        <div className="stat-card-dash progreso">
          <div className="stat-icon">🔄</div>
          <div className="stat-info">
            <h3>{estadisticas.en_progreso}</h3>
            <p>En Progreso</p>
          </div>
        </div>

        <div className="stat-card-dash completadas">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{estadisticas.completadas}</h3>
            <p>Completadas</p>
          </div>
        </div>

        <div className="stat-card-dash porcentaje">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h3>{porcentajeCompletado}%</h3>
            <p>Completado</p>
          </div>
        </div>
      </div>

      {/*NAVEGACION ENTRE SECCIONES*/}
      <div className="dashboard-nav">
        <button 
          className={seccionActiva === 'graficos' ? 'activo' : ''} 
          onClick={() => setSeccionActiva('graficos')}>
          📊 Graficos
        </button>
        <button 
          className={seccionActiva === 'timeline' ? 'activo' : ''} 
          onClick={() => setSeccionActiva('timeline')}>
          ⏳ Timeline
        </button>
        <button 
          className={seccionActiva === 'grafo' ? 'activo' : ''} 
          onClick={() => setSeccionActiva('grafo')}>
          🕸️ Grafo
        </button>
        <button 
          className={seccionActiva === 'seguridad' ? 'activo' : ''} 
          onClick={() => setSeccionActiva('seguridad')}>
          🛡️ Seguridad
        </button>
        <button 
          className={seccionActiva === 'analisis' ? 'activo' : ''} 
          onClick={() => setSeccionActiva('analisis')}>
          📈 Análisis
        </button>
      </div>

      {/*CONTENIDO PRINCIPAL - Cambia segun la seccioin activa*/}
      <div className="dashboard-content">
        
        {/*GRAFICOS*/}
        {seccionActiva === 'graficos' && (
          <div className="graficos-section">
            
            {/*GRAFICO DE BARRAS*/}
            <div className="grafico-card">
              <h3>📊 Tareas por Categoria</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={datosPorCategoria()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="categoria" stroke="#64748b" fontWeight="600" />
                  <YAxis stroke="#64748b" fontWeight="600" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white'
                    }}/>
                  <Bar dataKey="cantidad" fill="#667eea" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/*GRAFICO CIRCULAR*/}
            <div className="grafico-card">
              <h3>🎯 Distribucion por Estado</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={datosPorEstado()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value">
                    {datosPorEstado().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white'
                    }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/*GRAFICO DE LINEAS*/}
            <div className="grafico-card full-width">
              <h3>📈 Productividad en el Tiempo</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={datosPorFecha()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="fecha" stroke="#64748b" fontWeight="600" />
                  <YAxis stroke="#64748b" fontWeight="600" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white'
                    }}/>
                  <Line 
                    type="monotone" 
                    dataKey="tareas" 
                    stroke="#667eea" 
                    strokeWidth={3}
                    dot={{ fill: '#667eea', r: 6 }}
                    activeDot={{ r: 8 }}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/*TIMELINE*/}
        {seccionActiva === 'timeline' && (
          <div className="timeline-section">
            <h3>⏳ Historial de Actividades</h3>
            <div className="timeline-container">
              {tareas.length === 0 ? (
                <div className="empty-timeline">
                  <p>📭 No hay actividades registradas</p>
                </div>
              ) : (
                tareas.map((tarea) => (
                  <div key={tarea.id} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="timeline-date">
                        {new Date(tarea.fecha_creacion).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="timeline-title">{tarea.titulo}</div>
                      <div className="timeline-meta">
                        <span className={`badge-timeline ${tarea.prioridad}`}>
                          {tarea.prioridad}
                        </span>
                        <span className={`badge-timeline ${tarea.estado}`}>
                          {tarea.estado.replace('_', ' ')}
                        </span>
                        <span className="badge-timeline categoria">
                          {tarea.categoria}
                        </span>
                      </div>
                      {tarea.descripcion && (
                        <p className="timeline-desc">{tarea.descripcion}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/*GRAFO*/}
        {seccionActiva === 'grafo' && (
          <GrafoRelaciones tareas={tareas} />
        )}

        {/*SEGURIDAD*/}
        {seccionActiva === 'seguridad' && (
          <DashboardSeguridad usuarioId={usuarioId} />
        )}

        {/*ANALISIS*/}
        {seccionActiva === 'analisis' && (
          <EstadisticasAvanzadas tareas={tareas} />
          /*ESTADISTICAS ANTERIORES*/
          /*<div className="analisis-section">
            <h3>📈 Analisis Detallado</h3>
            
            <div className="analisis-grid">
              <div className="analisis-card">
                <h4>⚡ Tareas Criticas</h4>
                <div className="analisis-number">{estadisticas.criticas}</div>
                <p>Requieren atención inmediata</p>
              </div>

              <div className="analisis-card">
                <h4>🎯 Tasa de Completado</h4>
                <div className="analisis-number">{porcentajeCompletado}%</div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${porcentajeCompletado}%` }}
                  ></div>
                </div>
              </div>

              <div className="analisis-card">
                <h4>📅 Promedio Diario</h4>
                <div className="analisis-number">
                  {tareas.length > 0 ? Math.round(tareas.length / 7) : 0}
                </div>
                <p>Tareas por dia (ultima semana)</p>
              </div>

              <div className="analisis-card">
                <h4>🔥 Categoria Mas Activa</h4>
                <div className="analisis-text">
                  {datosPorCategoria().length > 0 ? datosPorCategoria().sort((a, b) => b.cantidad - a.cantidad)[0].categoria: 'N/A'}
                </div>
              </div>
            </div>
          </div>*/
        )}
      </div>
    </div>
  );
};

export default Dashboard;