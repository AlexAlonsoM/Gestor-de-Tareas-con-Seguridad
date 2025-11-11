//rafce (con la extension te autocompleta)
import React, { useState } from 'react' // useState -  manejar estado
import './Estilos/LogReg.css';

const Registro = ({CambioALogin, onRegister}) => {  //Recibe la variable de 'App'
  
  //Mensajes de Error
  const [mensajeError, setMensajeError] = useState('');

  //Se ejecuta al enviar el formulario
  const manejarEnvio = async (e) => {
    e.preventDefault(); //Evita que la pagina se recargue
    
    //Obtener el formulario de los inputs
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    const password2 = form.password2.value;
    const nombre = form.nombre.value;
    
    try {
      //Enviar datos al servidor PHP
      const respuesta = await fetch('http://localhost/Tareas/registro.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',   //Enviar datos en JSON
        },
        //Convertir los datos del formulario a JSON para enviarlos
        body: JSON.stringify({
          email: email,
          nombre: nombre,
          password: password,
          password2: password2
        })
      });

      //Convertir la respuesta de JSON a JS
      const datos = await respuesta.json();

      //Lo que devuelve el PHP
      if (datos.success) {
        onRegister(datos.user); //Para ir a Principal
      } else {
        setMensajeError(datos.message);
      }
    } catch (error) {
      setMensajeError('Error de conexion con el servidor');
    }
  };
  
  //-----------------------------------------------------------------
  return (
    <div className="contenedor-auth">
      <div className="tarjeta-auth">
        <h2>Registrarse</h2>

        {/*Mostrar mensaje de error*/}
        {mensajeError && <div style={{color: 'red', marginBottom: '1rem'}}>{mensajeError}</div>}

        {/*Formulario de registro*/}
        <form onSubmit ={manejarEnvio}>
          <div className="grupo-formulario">
            <label>Email:</label>
            <input type="email" name="email"/>
          </div>

          <div className="grupo-formulario">
            <label>Nombre usuario:</label>
            <input type="text" name="nombre"/>
          </div>
          
          <div className="grupo-formulario">
            <label>Contraseña:</label>
            <input type="password" name="password"/>
          </div>

          <div className="grupo-formulario">
            <label>Repita su Contraseña:</label>
            <input type="password" name="password2"/>
          </div>

          <button type="submit" className="boton-principal">Registrarse</button>
        </form>

        <p className="texto-enlace">
          ¿Ya tienes cuenta? 
          <button onClick={CambioALogin} className="boton-secundario">
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  )
}

export default Registro