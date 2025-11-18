import React from 'react';
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import './Estilos/EstadisticasAvanzadas.css';

const EstadisticasAvanzadas = ({ tareas }) => {

  //CALCULAR TIEMPO PROMEDIO PARA COMPLETAR TAREAS (en dias)
  const calcularTiempoPromedio = () => {
    //Filtrar solo tareas completadas que tengan fecha de completado
    const tareasCompletadas = tareas.filter(t => t.estado === 'completada' && t.fecha_completado);
    
    if (tareasCompletadas.length === 0) return 0;   //Si no hay tareas completadas

    //Calcular dias entre creacion y completado para cada tarea
    const tiempos = tareasCompletadas.map(tarea => {
      const inicio = new Date(tarea.fecha_creacion);
      const fin = new Date(tarea.fecha_completado);
      return Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)); //Convertir milisegundos a dias
    });

    //Calcular promedio y redondear
    const promedio = tiempos.reduce((sum, t) => sum + t, 0) / tiempos.length;
    return Math.round(promedio);
  };

  //PRODUCTIVIDAD ULTIMA SEMANA
  const calcularProductividadSemanal = () => {
    const hoy = new Date();
    const hace7Dias = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);    //Fecha de hace 7 dias

    //Filtrar tareas creadas
    const tareasUltimaSemana = tareas.filter(t => {
      const fecha = new Date(t.fecha_creacion);
      return fecha >= hace7Dias;
    });

    const completadasSemana = tareasUltimaSemana.filter(t => t.estado === 'completada').length;
    const totalSemana = tareasUltimaSemana.length;

    return {
      creadas: totalSemana,
      completadas: completadasSemana,
      porcentaje: totalSemana > 0 ? Math.round((completadasSemana / totalSemana) * 100) : 0
    };
  };

  //PRODUCTIVIDAD ULTIMO MES (30 dias)
  const calcularProductividadMensual = () => {
    const hoy = new Date();
    const hace30Dias = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000);  //Fecha de hace 30 dias

    //Filtrar tareas creadas en el ultimo mes
    const tareasUltimoMes = tareas.filter(t => {
      const fecha = new Date(t.fecha_creacion);
      return fecha >= hace30Dias;
    });

    const completadasMes = tareasUltimoMes.filter(t => t.estado === 'completada').length;
    const totalMes = tareasUltimoMes.length;

    return {
      creadas: totalMes,
      completadas: completadasMes,
      porcentaje: totalMes > 0 ? Math.round((completadasMes / totalMes) * 100) : 0
    };
  };

  //ANALIZAR RENDIMIENTO POR CATEGORIA (mejor y peor)
  const analizarCategorias = () => {
    const categorias = {};

    //Contar tareas totales y completadas por categoria
    tareas.forEach(tarea => {
      const cat = tarea.categoria;
      if (!categorias[cat]) {
        categorias[cat] = { total: 0, completadas: 0 };
      }
      categorias[cat].total++;
      if (tarea.estado === 'completada') {
        categorias[cat].completadas++;
      }
    });

    //Calcular porcentaje de completado por categoria
    const categoriasConPorcentaje = Object.keys(categorias).map(cat => ({
      nombre: cat,
      total: categorias[cat].total,
      completadas: categorias[cat].completadas,
      porcentaje: Math.round((categorias[cat].completadas / categorias[cat].total) * 100)
    }));

    //Ordenar por porcentaje (mejor a peor)
    categoriasConPorcentaje.sort((a, b) => b.porcentaje - a.porcentaje);

    //Categoria con peor rendimiento
    return {
      mejor: categoriasConPorcentaje[0] || { nombre: 'N/A', porcentaje: 0 },
      peor: categoriasConPorcentaje[categoriasConPorcentaje.length - 1] || { nombre: 'N/A', porcentaje: 0 }
    };  
  };

  //DISTRIBUCION POR PRIORIDAD
  const distribucionPorPrioridad = () => {
    const prioridades = { baja: 0, media: 0, alta: 0, critica: 0 };

    //Contar tareas por prioridad
    tareas.forEach(t => {
      prioridades[t.prioridad]++;
    });

    return [
      { nombre: 'Baja', valor: prioridades.baja, color: '#10b981' },
      { nombre: 'Media', valor: prioridades.media, color: '#f59e0b' },
      { nombre: 'Alta', valor: prioridades.alta, color: '#ef4444' },
      { nombre: 'Critica', valor: prioridades.critica, color: '#dc2626' }
    ];
  };

  //TENDENCIA DE ACTIVIDAD ULTIMOS 7 DIAS
  const tendenciaUltimos7Dias = () => {
    const hoy = new Date();
    const datos = [];

    //Generar datos para cada uno de los ultimos 7 dias
    for (let i = 6; i >= 0; i--) {
      const fecha = new Date(hoy.getTime() - i * 24 * 60 * 60 * 1000);
      const fechaStr = fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });

      //Contar tareas creadas y completadas en este dia especifico
      const tareasDelDia = tareas.filter(t => {
        const fechaTarea = new Date(t.fecha_creacion);
        return fechaTarea.toDateString() === fecha.toDateString();  //Mismo día
      });

      const completadasDelDia = tareasDelDia.filter(t => t.estado === 'completada').length;

      datos.push({
        fecha: fechaStr,
        creadas: tareasDelDia.length,
        completadas: completadasDelDia
      });
    }

    return datos;
  };

  //DATOS PARA GRAFICO RADAR: RENDIMIENTO POR CATEGORIA
  const rendimientoPorCategoria = () => {
    const categorias = {};

    //Calcular porcentaje de completado por categoria
    tareas.forEach(tarea => {
      const cat = tarea.categoria;
      if (!categorias[cat]) {
        categorias[cat] = { total: 0, completadas: 0 };
      }
      categorias[cat].total++;
      if (tarea.estado === 'completada') {
        categorias[cat].completadas++;
      }
    });

    //Convertir a formato para grafico rada
    return Object.keys(categorias).map(cat => ({
      categoria: cat,
      porcentaje: Math.round((categorias[cat].completadas / categorias[cat].total) * 100)
    }));
  };

  //Calcular todo
  const tiempoPromedio = calcularTiempoPromedio();
  const semana = calcularProductividadSemanal();
  const mes = calcularProductividadMensual();
  const { mejor, peor } = analizarCategorias();
  const prioridades = distribucionPorPrioridad();
  const tendencia = tendenciaUltimos7Dias();
  const radarData = rendimientoPorCategoria();

  //----------------------------------------------------------------------------------------
  return (
    <div className="estadisticas-avanzadas-container">
      
      {/*HEADER*/}
      <div className="estadisticas-header">
        <h2>Estadisticas Avanzadas</h2>
        <p>Analisis detallado de tu productividad</p>
      </div>

      {/*METRICAS PRINCIPALES*/}
      <div className="metricas-grid">
        
        <div className="metrica-card tiempo">
          <div className="metrica-icono">⏱️</div>
          <div className="metrica-info">
            <div className="metrica-valor">{tiempoPromedio}</div>
            <div className="metrica-label">Dias promedio para completar</div>
          </div>
        </div>

        <div className="metrica-card semana">
          <div className="metrica-icono">📅</div>
          <div className="metrica-info">
            <div className="metrica-valor">{semana.porcentaje}%</div>
            <div className="metrica-label">Productividad Semanal</div>
            <div className="metrica-detalle">{semana.completadas} de {semana.creadas} completadas</div>
          </div>
        </div>

        <div className="metrica-card mes">
          <div className="metrica-icono">📆</div>
          <div className="metrica-info">
            <div className="metrica-valor">{mes.porcentaje}%</div>
            <div className="metrica-label">Productividad Mensual</div>
            <div className="metrica-detalle">{mes.completadas} de {mes.creadas} completadas</div>
          </div>
        </div>

        <div className="metrica-card mejor">
          <div className="metrica-icono">🏆</div>
          <div className="metrica-info">
            <div className="metrica-valor-texto">{mejor.nombre}</div>
            <div className="metrica-label">Mejor Categoria</div>
            <div className="metrica-detalle">{mejor.porcentaje}% completadas</div>
          </div>
        </div>

      </div>

      {/*GRAFICOS*/}
      <div className="graficos-estadisticas">

        {/*TENDENCIA 7 DIAS*/}
        <div className="grafico-card-est full">
          <h3>📈 Tendencia ultimos 7 Dias</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={tendencia}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="fecha" stroke="#64748b" fontWeight="600" />
              <YAxis stroke="#64748b" fontWeight="600" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="creadas" stroke="#667eea" strokeWidth={3} name="Creadas" />
              <Line type="monotone" dataKey="completadas" stroke="#10b981" strokeWidth={3} name="Completadas" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/*DISTRIBUCION PRIORIDADES*/}
        <div className="grafico-card-est">
          <h3>🎯 Distribución por Prioridad</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={prioridades}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="nombre" stroke="#64748b" fontWeight="600" />
              <YAxis stroke="#64748b" fontWeight="600" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
                {prioridades.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/*RADAR CATEGORIAS*/}
        <div className="grafico-card-est">
          <h3>🕸️ Rendimiento por Categoria</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="categoria" stroke="#64748b" />
              <PolarRadiusAxis stroke="#64748b" />
              <Radar name="% Completadas" dataKey="porcentaje" stroke="#667eea" fill="#667eea" fillOpacity={0.6} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasAvanzadas;