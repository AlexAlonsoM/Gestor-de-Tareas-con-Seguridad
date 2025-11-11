import logo from './logo.svg'; 
import React, { useState } from 'react'; //Añadir useState
import Login from './components/Login';
import Registro from './components/Registro';
import Principal from './components/Principal';
import './App.css';

function App() {

  const [vistaActual, setVistaActual] = useState('login');  //Guardar el estado de la vista que vamos a ver (Inicializar en el Login)
  const [usuario, setUsuario] = useState(null);  //Uusuario logueado

  //Cambiar la vista a registro
  const cambiarVistaRegistro = () => {
    setVistaActual('registro');
  };

  //Cambiar la vista a login  
  const cambiarVistaLogin = () => {
    setVistaActual('login');
  };

  //Login exitoso
  const LoginExitoso = (datosUsuario) => {  //Recibe los datos del usuario desde el login/registro
    setUsuario(datosUsuario);
    setVistaActual('principal');
  };

  //Cerrar sesion
  const Logout = async () => {
    //Guardar logout en la bbdd
    if (usuario) {
      try {
        await fetch('http://localhost/Tareas/registrar_logout.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuario_id: usuario.id,
            nombre: usuario.name
          })
        });
      } catch (error) {
        console.error('Error al registrar logout:', error);
      }
    }
    
    setUsuario(null); //Elimina los datos del usuario
    setVistaActual('login');
  };

  //Saber en que vista estamos
  let VistaMostrar; //Variable temporal
  
  if (vistaActual === 'login') {
    VistaMostrar = <Login CambioARegistro={cambiarVistaRegistro} onLogin={LoginExitoso}/>;
  } else if (vistaActual === 'registro') {
    VistaMostrar = <Registro CambioALogin={cambiarVistaLogin} onRegister={LoginExitoso}/>;
  } else {
    VistaMostrar = <Principal user={usuario} onLogout={Logout}/>;
  }

  return (
    <div>
      {VistaMostrar}
    </div>
  );
}

export default App;
