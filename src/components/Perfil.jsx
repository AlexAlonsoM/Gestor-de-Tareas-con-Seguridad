import React, { useState } from 'react';
import './Estilos/Perfil.css';

const Perfil = ({ user, onActualizar }) => {

  //Estados para modales
  const [modalNombre, setModalNombre] = useState(false);
  const [modalPassword, setModalPassword] = useState(false);

  //Estados para cambio de nombre
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [mensajeNombre, setMensajeNombre] = useState({ tipo: '', texto: '' });  //Mensajes de exito/error
  const [cargandoNombre, setCargandoNombre] = useState(false);  //Estado

  //Estados para cambio de contraseña
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [passwordConfirmar, setPasswordConfirmar] = useState('');
  const [mensajePassword, setMensajePassword] = useState({ tipo: '', texto: '' });  //Mensajes de exito/error
  const [cargandoPassword, setCargandoPassword] = useState(false);  //Estado

  //CAMBIAR NOMBRE
  const manejarCambioNombre = async (e) => {
    e.preventDefault(); //Evita que recargue la pagina
    setMensajeNombre({ tipo: '', texto: '' });

    if (!nuevoNombre.trim()) {
      setMensajeNombre({ tipo: 'error', texto: 'El nombre no puede estar vacío' });
      return;
    }

    setCargandoNombre(true);

    try {
      const respuesta = await fetch('http://localhost/Tareas/cambiar_nombre.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: user.id,
          nuevo_nombre: nuevoNombre
        })
      });

      const datos = await respuesta.json();

      if (datos.success) {
        setMensajeNombre({ tipo: 'exito', texto: '✅ Nombre actualizado correctamente' });
        setTimeout(() => {
          window.location.reload(); //Recargar web para actualizar el nombre
        }, 1500);
      } else {
        setMensajeNombre({ tipo: 'error', texto: datos.message || 'Error al cambiar nombre' });
      }
    } catch (error) {
      setMensajeNombre({ tipo: 'error', texto: 'Error de conexión' });
    } finally {
      setCargandoNombre(false);
    }
  };

  //CAMBIAR CONTRASEÑA
  const manejarCambioPassword = async (e) => {
    e.preventDefault();
    setMensajePassword({ tipo: '', texto: '' });

    if (!passwordActual || !passwordNueva || !passwordConfirmar) {
      setMensajePassword({ tipo: 'error', texto: 'Completa todos los campos' });
      return;
    }

    if (passwordNueva !== passwordConfirmar) {
      setMensajePassword({ tipo: 'error', texto: 'Las contraseñas nuevas no coinciden' });
      return;
    }

    setCargandoPassword(true);

    try {
      const respuesta = await fetch('http://localhost/Tareas/cambiar_password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: user.id,
          password_actual: passwordActual,
          password_nueva: passwordNueva
        })
      });

      const datos = await respuesta.json();

      if (datos.success) {
        setMensajePassword({ tipo: 'exito', texto: '✅ Contraseña actualizada correctamente' });
        setPasswordActual('');
        setPasswordNueva('');
        setPasswordConfirmar('');
        setTimeout(() => {
          setModalPassword(false);
          setMensajePassword({ tipo: '', texto: '' });
        }, 2000);
      } else {
        setMensajePassword({ tipo: 'error', texto: datos.message || 'Error al cambiar contraseña' });
      }
    } catch (error) {
      setMensajePassword({ tipo: 'error', texto: 'Error de conexión' });
    } finally {
      setCargandoPassword(false);
    }
  };

  //-----------------------------------
  return (
    <div>
      <div className="perfil-container">
        {/*INFORMACION*/}
        <div className="perfil-card">
          <div className="perfil-header">
            <div className="perfil-avatar">
              {user.name.charAt(0).toUpperCase()} {/*Mostrar primera letra del nombre como "imagen de perfil"*/}
            </div>
            <div className="perfil-info">
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
          </div>

          {/*DETALLES DEL PERFIL*/}
          <div className="perfil-detalles">
            <div className="detalle-item">
              <span className="detalle-label">👤 Nombre:</span>
              <span className="detalle-valor">{user.name}</span>
            </div>
            <div className="detalle-item">
              <span className="detalle-label">📧 Email:</span>
              <span className="detalle-valor">{user.email}</span>
            </div>
            <div className="detalle-item">
              <span className="detalle-label">🆔 ID Usuario:</span>
              <span className="detalle-valor">#{user.id}</span>
            </div>
          </div>

          <div className="perfil-acciones">
            <button className="btn-accion btn-nombre" onClick={() => setModalNombre(true)}>
              ✏️ Cambiar Nombre
            </button>
            <button className="btn-accion btn-password" onClick={() => setModalPassword(true)}>
              🔐 Cambiar Contraseña
            </button>
          </div>
        </div>

      </div>

      {/*MODAL CAMBIAR NOMBRE*/}
      {modalNombre && (
        <div className="modal-overlay" onClick={() => setModalNombre(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalNombre(false)}>×</button>
            
            <h2>✏️ Cambiar Nombre</h2>

            {mensajeNombre.texto && (
              <div className={`mensaje mensaje-${mensajeNombre.tipo}`}>
                {mensajeNombre.texto}
              </div>
            )}

            <form onSubmit={manejarCambioNombre}>
              <div className="form-group">
                <label>Nombre Actual:</label>
                <input type="text" value={user.name} disabled />
              </div>

              <div className="form-group">
                <label>Nuevo Nombre:</label>
                <input
                  type="text"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  disabled={cargandoNombre}
                  placeholder="Ingresa tu nuevo nombre"
                  required/>
              </div>

              <div className="modal-acciones">
                <button type="submit" className="btn-guardar" disabled={cargandoNombre}>
                  {cargandoNombre ? 'Guardando...' : 'Guardar'}
                </button>
                <button type="button" onClick={() => setModalNombre(false)} className="btn-cancelar"disabled={cargandoNombre}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/*MODAL CAMBIAR CONTRASEÑA*/}
      {modalPassword && (
        <div className="modal-overlay" onClick={() => setModalPassword(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalPassword(false)}>×</button>
            
            <h2>🔐 Cambiar Contraseña</h2>

            {mensajePassword.texto && (
              <div className={`mensaje mensaje-${mensajePassword.tipo}`}>
                {mensajePassword.texto}
              </div>
            )}

            <form onSubmit={manejarCambioPassword}>
              <div className="form-group">
                <label>Contraseña Actual:</label>
                <input
                  type="password"
                  value={passwordActual}
                  onChange={(e) => setPasswordActual(e.target.value)}
                  disabled={cargandoPassword}
                  required/>
              </div>

              <div className="form-group">
                <label>Nueva Contraseña:</label>
                <input
                  type="password"
                  value={passwordNueva}
                  onChange={(e) => setPasswordNueva(e.target.value)}
                  disabled={cargandoPassword}
                  required/>
                <small className="password-hint">
                  Mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial
                </small>
              </div>

              <div className="form-group">
                <label>Confirmar Nueva Contraseña:</label>
                <input
                  type="password"
                  value={passwordConfirmar}
                  onChange={(e) => setPasswordConfirmar(e.target.value)}
                  disabled={cargandoPassword}
                  required/>
              </div>

              <div className="modal-acciones">
                <button type="submit" className="btn-guardar" disabled={cargandoPassword}>
                  {cargandoPassword ? 'Guardando...' : 'Guardar'}
                </button>
                <button type="button" onClick={() => setModalPassword(false)} className="btn-cancelar"disabled={cargandoPassword}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;