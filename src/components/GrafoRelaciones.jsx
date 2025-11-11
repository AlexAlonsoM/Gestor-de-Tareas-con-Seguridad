import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';   //Para renderizar elementos fuera del DOM (se suelen renderizar todos alli) - El tooltip necesita aparecer ENCIMA de los demas
import { Network } from 'vis-network';      //Libreria para visualizacion de grafos
import './Estilos/GrafoRelaciones.css';
//useState (cambia, Si se re-renderiza)
//useRef (cambia, NO se re-renderiza)

const GrafoRelaciones = ({ tareas }) => {
  const containerRef = useRef(null);  //Referencia al contenedor del grafo
  const networkRef = useRef(null);    //Referencia a la instancia de vis-network (objeto que controla el grafo)
  const [mostrarAyuda, setMostrarAyuda] = useState(false);  //Control modal de ayuda (Lo muestra o no)
  const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });  //Tooltip flotante

  //EFECTO PRINCIPAL (Construye y actualiza el grafo)
  useEffect(() => {
    //Si no hay contenedor o no hay tareas, no hacer nada
    if (!containerRef.current || !tareas || tareas.length === 0) return;

    //Estructura de datos para el grafo
    const nodes = []; //Almacena los nodos (puntos del grafo)
    const edges = []; // Almacena las lineas entre nodos

    const coloresPrioridad = {
      baja: '#10b981',
      media: '#f59e0b',
      alta: '#ef4444',
      critica: '#dc2626'
    };

    //Nodo central
    nodes.push({
      id: 'centro',
      label: 'Tareas',
      color: { background: '#667eea', border: '#4c51bf' },
      font: { color: '#1a1f36', size: 18, bold: true },
      size: 45,
      shape: 'dot',
      info: { tipo: 'centro', nombre: 'Centro: Todas tus tareas' }    //Datos para tooltip
    });

    //Categorias
    const categorias = [...new Set(tareas.map(t => t.categoria))];  //Guardar solo los nombres de categorias sin repetir
    categorias.forEach((cat) => {
      const catId = "cat-" + cat;   //ID unico para la categoria
      const tareasEnCat = tareas.filter(t => t.categoria === cat).length; //Conteo de tareas
      
      nodes.push({
        id: catId,
        label: cat,
        color: { background: '#764ba2', border: '#6b46c1' },
        font: { color: '#1a1f36', size: 15, bold: true },
        size: 35,
        shape: 'dot',
        info: { tipo: 'categoria', nombre: cat, cantidad: tareasEnCat }   //Datos para tooltip
      });

      //Conectar categoria con nodo central
      edges.push({
        from: 'centro',   //Desde el nodo central
        to: catId,        //Hasta la categoria
        color: { color: '#667eea' },
        width: 4
      });
    });

    //Tareas individuales
    tareas.forEach(tarea => {
      const tareaId = "tarea-" + tarea.id;    //ID unico para la tarea
      
      nodes.push({
        id: tareaId,
        label: tarea.titulo.substring(0, 15),
        color: {
          background: coloresPrioridad[tarea.prioridad] || '#667eea',
          border: '#ffffff'
        },
        font: { color: '#1a1f36', size: 12, bold: true },
        size: 25,
        shape: 'dot',
        info: {   //Datos para tooltip
          tipo: 'tarea',
          titulo: tarea.titulo,
          estado: tarea.estado,
          prioridad: tarea.prioridad,
          categoria: tarea.categoria,
          descripcion: tarea.descripcion
        }
      });

      //Conectar tarea con su categorIa
      edges.push({
        from: "cat-" + tarea.categoria,   //Desde la categoria
        to: tareaId,                      //Hasta la tarea individual
        color: { color: coloresPrioridad[tarea.prioridad] || '#667eea' },
        width: 2
      });
    });

    //Configuracion del grafo
    const data = { nodes, edges };
    
    const options = {
      nodes: {
        borderWidth: 4,
        shadow: true  //Sombra para efecto 3D
      },
      edges: {
        smooth: { type: 'continuous' }  //Lineas curvas suaves
      },
      //Sin fisicas todos los nodos estarian amontonados
      physics: {
        enabled: true,  //Los nodos se "repelen" entre si
        stabilization: { iterations: 150 }  //Posicion optima de cada nodo
      },
      interaction: {
        hover: true,      //Permitir hover
        dragNodes: true,  //Permitir arrastrar nodos
        dragView: true,   //Permitir mover la vista
        zoomView: false   //Deshabilitar zoom
      }
    };

    //Si el componente se vuelve a renderizar (nuevas tareas), limpiar el grafo anterior
    if (networkRef.current) {
      networkRef.current.destroy();
    }
    
    //Crear nueva instancia del grafo
    networkRef.current = new Network(containerRef.current, data, options);

    //Mostrar tooltip al pasar sobre un nodo
    networkRef.current.on('hoverNode', (params) => {
      const nodeId = params.node;   //ID del nodo
      const node = nodes.find(n => n.id === nodeId);    //Busca el nodo en nuestro array
      
      if (node && node.info) {
        let contenido = '';
        
        //Contenido dinamico segun el tipo de nodo
        if (node.info.tipo === 'centro') {
          contenido = `<strong>${node.info.nombre}</strong>`;
        } else if (node.info.tipo === 'categoria') {
          contenido = `<strong>📁 ${node.info.nombre}</strong><br/>${node.info.cantidad} tarea(s)`;
        } else if (node.info.tipo === 'tarea') {
          contenido = `
            <strong>${node.info.titulo}</strong><br/>
            <span class="tooltip-label">Estado:</span> ${node.info.estado.replace('_', ' ')}<br/>
            <span class="tooltip-label">Prioridad:</span> ${node.info.prioridad}<br/>
            <span class="tooltip-label">Categoría:</span> ${node.info.categoria}
            ${node.info.descripcion ? `<br/><em>${node.info.descripcion.substring(0, 60)}...</em>` : ''}
          `;
        }
        
        //Obtener la posicion del scroll actualemnte
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        
        setTooltip({
          visible: true,
          content: contenido,
          x: params.event.clientX + scrollX,
          y: params.event.clientY + scrollY
        });
      }
    });

    //Ocultar tooltip al salir del nodo
    networkRef.current.on('blurNode', () => {
      setTooltip({ visible: false, content: '', x: 0, y: 0 });
    });

    //Ocultar tooltip al arrastrar
    networkRef.current.on('dragging', () => {
      setTooltip({ visible: false, content: '', x: 0, y: 0 });
    });

    //Destruir instancia al desmontar el componente (El grafo seguiria consumiendo memoria aunque no sea visible)
    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
      }
    };
  }, [tareas]);   //Se ejecuta cada vez que cambia el array de tareas

  //Mensaje cuando no hay tareas
  if (!tareas || tareas.length === 0) {
    return (
      <div className="grafo-empty">
        <div className="empty-state">
          <h3>🕸️ No hay datos para visualizar</h3>
          <p>Crea algunas tareas para ver el grafo de relaciones</p>
        </div>
      </div>
    );
  }

  //-----------------------------------------------------------------------------------------------
  return (
    <div>
      {/*TOOLTIP usando portal (Se renderiza en el body)*/}
      {tooltip.visible && createPortal(
        <div 
          className="grafo-tooltip"
          //Posicionamiento
          style={{
            left: `${tooltip.x + 15}px`,
            top: `${tooltip.y - 10}px`
          }}
          dangerouslySetInnerHTML={{ __html: tooltip.content }}   //Renderizar HTML del tooltip
        />,
        document.body
      )}

      {/*CONTENEDOR PRINCIPAL DEL GRAFO*/}
      <div className="grafo-container">
        {/*Modal de 'Ayuda'*/}
        {mostrarAyuda && (
          <div className="modal-ayuda-overlay" onClick={() => setMostrarAyuda(false)}>
            <div className="modal-ayuda-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setMostrarAyuda(false)}>×</button>
              
              <h2>🕸️ Grafo de Relaciones</h2>
              
              <div className="ayuda-seccion">
                <h3>¿Que ves aqui?</h3>
                <p>Una red que conecta tus tareas por categorias.</p>
              </div>

              <div className="ayuda-seccion">
                <h3>Colores:</h3>
                <ul>
                  <li>🔵 Azul: Centro (todas las tareas)</li>
                  <li>🟣 Morado: Categorias</li>
                  <li>🟢 Verde: Prioridad Baja</li>
                  <li>🟠 Naranja: Prioridad Media</li>
                  <li>🔴 Rojo: Prioridad Alta/Crítica</li>
                </ul>
              </div>

              <div className="ayuda-seccion">
                <h3>Interacciones:</h3>
                <ul>
                  <li>Arrastra los nodos para reorganizar</li>
                  <li>Pasa el mouse sobre un nodo para ver información</li>
                </ul>
              </div>

              <button className="btn-entendido" onClick={() => setMostrarAyuda(false)}>
                ✓ Entendido
              </button>
            </div>
          </div>
        )}

        {/*HEADER*/}
        <div className="grafo-header">
          <div className="header-titulo">
            <h3>🕸️ Grafo de Relaciones</h3>
            <p>{tareas.length} tarea(s) conectadas</p>
          </div>
          <button className="btn-ayuda" onClick={() => setMostrarAyuda(true)}>
            ❓ Ayuda
          </button>
        </div>

        {/*LEYENDA (para interpretar el grafo)*/}
        <div className="grafo-leyenda">
          <div className="leyenda-grupo">
            <span className="leyenda-titulo">Tipos:</span>
            <div className="leyenda-item">
              <div className="leyenda-dot" style={{ background: '#667eea' }}></div>
              <span>Central</span>
            </div>
            <div className="leyenda-item">
              <div className="leyenda-dot" style={{ background: '#764ba2' }}></div>
              <span>Categoría</span>
            </div>
          </div>

          <div className="leyenda-grupo">
            <span className="leyenda-titulo">Prioridades:</span>
            <div className="leyenda-item">
              <div className="leyenda-dot" style={{ background: '#10b981' }}></div>
              <span>Baja</span>
            </div>
            <div className="leyenda-item">
              <div className="leyenda-dot" style={{ background: '#f59e0b' }}></div>
              <span>Media</span>
            </div>
            <div className="leyenda-item">
              <div className="leyenda-dot" style={{ background: '#ef4444' }}></div>
              <span>Alta</span>
            </div>
            <div className="leyenda-item">
              <div className="leyenda-dot" style={{ background: '#dc2626' }}></div>
              <span>Crítica</span>
            </div>
          </div>
        </div>

        {/*GRAFO*/}
        <div className="grafo-canvas">
          <div ref={containerRef} className="vis-network-container"></div>
        </div>

        {/*CONTROLES*/}
        <div className="grafo-controles">
          <p>💡 Arrastra los nodos y pasa el mouse para ver información</p>
        </div>
      </div>
    </div>
  );
};

export default GrafoRelaciones;