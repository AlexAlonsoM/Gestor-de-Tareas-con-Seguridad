import React from 'react';
import './Estilos/CargadorEsqueleto.css';

const CargadorEsqueleto = ({ tipo = 'tarea', cantidad = 3 }) => {
  
    //Esqueleto lista de tareas
    if (tipo === 'tarea') {
        return (
        <div className="esqueleto-contenedor">
            {[...Array(cantidad)].map((_, index) => (
            <div key={index} className="esqueleto-tarea">
                <div className="esqueleto-encabezado">
                <div className="esqueleto-titulo"></div>
                <div className="esqueleto-insignias">
                    <div className="esqueleto-insignia"></div>
                    <div className="esqueleto-insignia"></div>
                </div>
                </div>
                <div className="esqueleto-descripcion"></div>
                <div className="esqueleto-descripcion corta"></div>
                <div className="esqueleto-pie">
                <div className="esqueleto-info"></div>
                <div className="esqueleto-acciones"></div>
                </div>
            </div>
            ))}
        </div>
        );
    }

    //esqueleto tarjetas de estadisticas
    if (tipo === 'estadistica') {
        return (
        <div className="esqueleto-stats-cuadricula">
            {[...Array(cantidad)].map((_, index) => (
            <div key={index} className="esqueleto-stat-tarjeta">
                <div className="esqueleto-stat-numero"></div>
                <div className="esqueleto-stat-texto"></div>
            </div>
            ))}
        </div>
        );
    }

    return null;
};

export default CargadorEsqueleto;