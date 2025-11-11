import React, { useState } from 'react';
import GestionTareas from './GestionTareas';
import Dashboard from './Dashboard';  //Importar el componente Dashboard
import './Estilos/Principal.css';

const Principal = ({ user, onLogout }) => {   //Recibe: Datos del usuario - funcion para cerrar sesion

  const [vistaActiva, setVistaActiva] = useState('tareas');  //Valor inicial: vista de tareas

  return (
    <div className="contenedor-principal">
      {/*HEADER*/}
      <header className="header-principal">
        <div className="header-content">
          <h1>🔒 Security Task Manager</h1>
          
          {/*Botones de navegacion*/}
          <div className="header-actions">
            <button className={`nav-btn ${vistaActiva === 'tareas' ? 'activo' : ''}`}onClick={() => setVistaActiva('tareas')}>
              📋 Tareas
            </button>
            <button className={`nav-btn ${vistaActiva === 'dashboard' ? 'activo' : ''}`}onClick={() => setVistaActiva('dashboard')}>
              📊 Dashboard
            </button>
          </div>
          
          {/*Informacion de usuario y logout */}
          <div className="user-info">
            <span>Bienvenido, <strong>{user.name}</strong></span>
            <button onClick={onLogout} className="btn-logout">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/*CONTENIDO PRINCIPAL*/}
      <main className="main-content">
        {/*Muestra GestionTareas y pasa el ID del usuario*/}
        {vistaActiva === 'tareas' && <GestionTareas usuarioId={user.id} />}
        {/*Muestra el Dashboard y pasa el ID del usuario**/}
        {vistaActiva === 'dashboard' && <Dashboard usuarioId={user.id} />}
      </main>

      {/*FOOTER*/}
      <footer className="footer-principal">
        <p>Tareas pagina web</p>
      </footer>
    </div>
  );
};

export default Principal;