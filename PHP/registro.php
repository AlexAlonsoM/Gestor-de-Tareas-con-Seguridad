<?php
include 'conexion.php';

header("Access-Control-Allow-Origin: http://localhost:3000"); //Permite que React se comunique con PHP
header("Content-Type: application/json"); //Le dice al navegador que lo que te voy a enviar es JSON
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

//Obtener datos de React (en formato JSON)
$data = json_decode(file_get_contents("php://input"), true);
//php://input = Contiene los datos que React envía (en formato JSON)
//json_decode() = Convierte el JSON en un array de PHP
//$data = Array con los datos del formulario de React

$email = $data['email'];
$nombre = $data['nombre'];
$password = $data['password'];
$password2 = $data['password2'];

//Buscar usuario
$sql = "SELECT * FROM usuario WHERE correo = '$email'";
$resultado = $conexion->query($sql);

if ($resultado->num_rows == 0) {
    
    //Verificar que sean la misma contraseña (sin hash)
    if ($password == $password2) {

        $errores = [];
    
        //Longitud minima
        if (strlen($password) < 8) {
            $errores[] = "La contraseña debe tener al menos 8 caracteres";
        }
        
        //Mayuscula
        if (!preg_match('/[A-Z]/', $password)) {
            $errores[] = "La contraseña debe tener al menos una letra mayuscula";
        }
        
        //Minuscula  
        if (!preg_match('/[a-z]/', $password)) {
            $errores[] = "La contraseña debe tener al menos una letra minuscula";
        }
        
        //Numero
        if (!preg_match('/[0-9]/', $password)) {
            $errores[] = "La contraseña debe tener al menos un numero";
        }
        
        //Caracter especial
        if (!preg_match('/[!@#$%^&*(),.?":{}|<>-_]/', $password)) {
            $errores[] = "La contraseña debe tener al menos un caracter especial";
        }

        //Si hay errores
        if (!empty($errores)) {
            echo json_encode(["success" => false, "message" => "Contraseña débil: " . implode(", ", $errores)]);
            exit;
        } else {
            //Obtener la max ID
            $sql_max = "SELECT MAX(id) as max_id FROM usuario";
            $resultado_max = $conexion->query($sql_max);
            if($resultado_max->num_rows == 0){
                $nuevo_id = 1;
            } else {
                $fila = $resultado_max->fetch_assoc();
                $nuevo_id = $fila['max_id'] + 1;
            }
            
            //Insertar usuario bbdd
            $insert_sql = "INSERT INTO usuario (id, nombre, correo, password) VALUES ('$nuevo_id', '$nombre', '$email', '$password')";
            
            if ($conexion->query($insert_sql)) {
                echo json_encode([
                    "success" => true,
                    "user" => [
                        "id" => $nuevo_id,
                        "name" => $nombre,
                        "email" => $email
                    ]
                ]);
            } else {
                echo json_encode(["success" => false, "message" => "Error al registrar usuario"]);
            }
        }       
    } else {
        echo json_encode(["success" => false, "message" => "Las contraseñas no coinciden"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "El usuario ya existe"]);
}
?>