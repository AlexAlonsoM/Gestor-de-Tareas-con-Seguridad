import React, { useState } from 'react';
import './Estilos/LogReg.css';

const Login = ({CambioARegistro, onLogin}) => {
  //Estado mensajes de error
  const [mensajeError, setMensajeError] = useState('');

  //Eenvio del formulario de login
  const manejarEnvio = async (e) => {
    e.preventDefault(); //Evita el recargo de la pagina al enviar el formulario (Obliogatorio)
    
    //Obtener los datos del formulario desde los inputs
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    

    if (!email || !password) {
      setMensajeError('Por favor completa todos los campos');
      return;
    }
    

    try {
      //Enviar la peticion de login
      const respuesta = await fetch('http://localhost/Tareas/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', //Indica que se envian datos JSON
        },
        body: JSON.stringify({  //Conviertir los datos a JSON
          email: email,
          password: password
        })
      });

      //Obtener la respuesta del servidor como texto
      const textoRespuesta = await respuesta.text();

      let datos;
      try {
        //Convierte la respuesta de texto a JSON
        datos = JSON.parse(textoRespuesta);
      } catch (errorJSON) {
        setMensajeError('Error: El servidor no respondio correctamente');
        return;
      }

      //Si el login fue exitoso
      if (datos.success) {
        onLogin(datos.user);
      } else {
        setMensajeError(datos.message);
      }
    } catch (error) {
      setMensajeError('Error de conexion: ' + error.message);
    }
  };

  //--------------------------------------------------------------------------------------------------------------
  return (
    <div className="contenedor-auth">
      <div className="tarjeta-auth">
        <h2>Iniciar Sesión</h2>

        {/*Mensaje de Error*/}
        {mensajeError && (
          <div style={{
            color: 'white',
            backgroundColor: '#ef4444',
            marginBottom: '1rem',
            padding: '1rem',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}>
            ⚠️ {mensajeError}
          </div>
        )}

        {/*Formulario login*/}
        <form onSubmit={manejarEnvio}>
          <div className="grupo-formulario">
            <label>Email:</label>
            <input type="email" name="email" required />
          </div>
          
          <div className="grupo-formulario">
            <label>Contraseña:</label>
            <input type="password" name="password" required />
          </div>

          <button type="submit" className="boton-principal">
            Entrar
          </button>
        </form>

        <p className="texto-enlace">
          ¿No tienes cuenta? 
          <button onClick={CambioARegistro} className="boton-secundario">
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;