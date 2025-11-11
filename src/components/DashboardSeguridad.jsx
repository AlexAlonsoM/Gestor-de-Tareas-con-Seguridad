import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import './Estilos/DashboardSeguridad.css';

const DashboardSeguridad = ({ usuarioId }) => {
  const [logs, setLogs] = useState([]);   //Almacena todos los logs de seguridad
  const [mostrarAyuda, setMostrarAyuda] = useState(false);  //Control modal

  useEffect(() => {
    cargarLogs();
  }, [usuarioId]);

  //Cargar los logs
  const cargarLogs = async () => {
    try {
      const respuesta = await fetch(`http://localhost/Tareas/obtener_logs.php?usuario_id=${usuarioId}`);
      const datos = await respuesta.json();
      if (datos.success) {
        setLogs(datos.logs);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  //ESTADISTICAS
  const estadisticas = {
    total: logs.length,
    criticos: logs.filter(l => l.nivel_severidad === 'critico').length,
    altos: logs.filter(l => l.nivel_severidad === 'alto').length,
    medios: logs.filter(l => l.nivel_severidad === 'medio').length,
    bajos: logs.filter(l => l.nivel_severidad === 'bajo').length,
    loginsFallidos: logs.filter(l => l.tipo_evento === 'login_fallido').length,
    loginsExitosos: logs.filter(l => l.tipo_evento === 'login_exitoso').length
  };

  //GRAFICO CIRCULA
  const datosSeveridad = [
    { name: 'Crítico', value: estadisticas.criticos, color: '#dc2626' },
    { name: 'Alto', value: estadisticas.altos, color: '#ef4444' },
    { name: 'Medio', value: estadisticas.medios, color: '#f59e0b' },
    { name: 'Bajo', value: estadisticas.bajos, color: '#10b981' }
  ].filter(item => item.value > 0);

  //GRAFICO DE LINEAS
  const datosLinea = () => {
    const fechas = {};
    //Agrupa por fecha
    logs.forEach(log => {
      const fecha = new Date(log.fecha_evento).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short'
      });
      fechas[fecha] = (fechas[fecha] || 0) + 1;
    });

    //Para tener los mas recientes primero (ultimos 7 dias)
    return Object.keys(fechas).map(fecha => ({
      fecha,
      eventos: fechas[fecha]
    })).reverse().slice(0, 7);
  };

  //OBTENER ICONOS
  const obtenerIcono = (tipo) => {
    const iconos = {
      'login_exitoso': '✅',
      'login_fallido': '❌',
      'tarea_critica': '🔥',
      'cambio_password': '🔐',
      'acceso_sospechoso': '⚠️',
      'tarea_eliminada': '🗑️',
      'sesion_cerrada': '🚪'
    };
    return iconos[tipo] || '📋';
  };

  //OBTENER COLORES
  const obtenerColorSeveridad = (severidad) => {
    const colores = {
      'critico': '#dc2626',
      'alto': '#ef4444',
      'medio': '#f59e0b',
      'bajo': '#10b981'
    };
    return colores[severidad] || '#697386';
  };

  //Si no hay logs
  if (logs.length === 0) {
    return (
      <div className="seguridad-empty">
        <div className="empty-state">
          <h3>🛡️ No hay eventos de seguridad registrados</h3>
          <p>Los eventos se registraran automaticamente</p>
        </div>
      </div>
    );
  }

  //--------------------------------------------------------------
  return (
    <div className="seguridad-container">
      
      {/*MODAL DE AYUDA*/}
      {mostrarAyuda && (
        <div className="modal-ayuda-overlay" onClick={() => setMostrarAyuda(false)}>
          <div className="modal-ayuda-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setMostrarAyuda(false)}>×</button>
            
            <h2>🛡️ Dashboard de Seguridad</h2>
            
            <div className="ayuda-seccion">
              <h3>¿Que es esto?</h3>
              <p>Un panel que registra todos los eventos de seguridad de tu cuenta.</p>
            </div>

            <div className="ayuda-seccion">
              <h3>Niveles de Severidad:</h3>
              <ul>
                <li>🟢 <strong>Bajo:</strong> Eventos normales (login, logout)</li>
                <li>🟠 <strong>Medio:</strong> Cambios importantes</li>
                <li>🔴 <strong>Alto:</strong> Tareas criticas, accesos sospechosos</li>
                <li>⚫ <strong>Crítico:</strong> Multiples intentos fallidos</li>
              </ul>
            </div>

            <div className="ayuda-seccion">
              <h3>Eventos Registrados:</h3>
              <ul>
                <li>Inicios de sesion (exitosos y fallidos)</li>
                <li>Creacion/eliminacion de tareas</li>
                <li>Cambios de contraseña</li>
                <li>Actividad sospechosa</li>
              </ul>
            </div>

            <button className="btn-entendido" onClick={() => setMostrarAyuda(false)}>
              ✓ Entendido
            </button>
          </div>
        </div>
      )}

      {/*HEADER*/}
      <div className="seguridad-header">
        <div className="header-titulo">
          <h3>🛡️ Dashboard de Seguridad</h3>
          <p>{estadisticas.total} eventos registrados</p>
        </div>
        <button className="btn-ayuda" onClick={() => setMostrarAyuda(true)}>
          ❓ Ayuda
        </button>
      </div>

      {/*ESTADISTICAS*/}
      <div className="stats-seguridad">
        <div className="stat-card-seg total">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{estadisticas.total}</h3>
            <p>Total Eventos</p>
          </div>
        </div>

        <div className="stat-card-seg critico">
          <div className="stat-icon">🚨</div>
          <div className="stat-info">
            <h3>{estadisticas.criticos}</h3>
            <p>Criticos</p>
          </div>
        </div>

        <div className="stat-card-seg alto">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>{estadisticas.altos}</h3>
            <p>Altos</p>
          </div>
        </div>

        <div className="stat-card-seg login-fallido">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <h3>{estadisticas.loginsFallidos}</h3>
            <p>Logins Fallidos</p>
          </div>
        </div>

        <div className="stat-card-seg login-exitoso">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{estadisticas.loginsExitosos}</h3>
            <p>Logins Exitosos</p>
          </div>
        </div>
      </div>

      {/*GRAFICOS*/}
      <div className="graficos-seguridad">
        
        {/*GRAFICO CIRCULAR*/}
        <div className="grafico-card-seg">
          <h3>📊 Distribucion por Severidad</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={datosSeveridad}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value">
                {datosSeveridad.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/*GRAFICO DE LINEAS*/}
        <div className="grafico-card-seg full-width">
          <h3>📈 Evolución de Eventos (Ultimos 7 dIas)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={datosLinea()}>
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
                dataKey="eventos" 
                stroke="#dc2626" 
                strokeWidth={3}
                dot={{ fill: '#dc2626', r: 6 }}
                activeDot={{ r: 8 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/*TIMELINE DE EVENTOS*/}
      <div className="eventos-recientes">
        <h3>🚨 Eventos Recientes</h3>
        <div className="timeline-seguridad">
          {logs.slice(0, 15).map((log) => ( //Muestra los 15 eventos mAs recientes
            <div key={log.id} className={`evento-item severidad-${log.nivel_severidad}`}>
              <div className="evento-icono">
                {obtenerIcono(log.tipo_evento)}
              </div>
              <div className="evento-contenido">
                <div className="evento-header">
                  <span className="evento-tipo">{log.tipo_evento.replace('_', ' ').toUpperCase()}</span>
                  <span 
                    className="evento-severidad"
                    style={{ backgroundColor: obtenerColorSeveridad(log.nivel_severidad) }}
                  >
                    {log.nivel_severidad}
                  </span>
                </div>
                <p className="evento-descripcion">{log.descripcion}</p>
                <div className="evento-meta">
                  <span>🕐 {new Date(log.fecha_evento).toLocaleString('es-ES')}</span>
                  <span>🌐 {log.ip_address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSeguridad;