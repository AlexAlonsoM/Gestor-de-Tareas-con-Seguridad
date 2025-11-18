<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'conexion.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$usuario_id = $data['usuario_id'] ?? null;
$password_actual = $data['password_actual'] ?? '';
$password_nueva = $data['password_nueva'] ?? '';

if (!$usuario_id || !$password_actual || !$password_nueva) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit();
}

//VALIDAR CONTRASEÑA
$errores = [];

//Longitud minima
if (strlen($password_nueva) < 8) {
    $errores[] = "Al menos 8 caracteres";
}

//Mayuscula
if (!preg_match('/[A-Z]/', $password_nueva)) {
    $errores[] = "Al menos una letra mayuscula";
}

//Minuscula  
if (!preg_match('/[a-z]/', $password_nueva)) {
    $errores[] = "Al menos una letra minuscula";
}

//Numero
if (!preg_match('/[0-9]/', $password_nueva)) {
    $errores[] = "Al menos un numero";
}

//Caracter especial
if (!preg_match('/[!@#$%^&*(),.?":{}|<>\-_]/', $password_nueva)) {
    $errores[] = "Al menos un caracter especial (!@#$%...)";
}

if (!empty($errores)) {
    echo json_encode(["success" => false, "message" => "Contraseña débil: " . implode(", ", $errores)]);
    exit();
}

//OBTENER USUARIO
$sql = "SELECT * FROM usuario WHERE id = $usuario_id";
$resultado = $conexion->query($sql);

if ($resultado->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
    exit();
}

$usuario = $resultado->fetch_assoc();

//VERIFICAR CONTRASEÑA ACTUAL
if ($password_actual !== $usuario['password']) {
    echo json_encode(["success" => false, "message" => "La contraseña actual es incorrecta"]);
    exit();
}

//ACTUALIZAR CONTRASEÑA
$password_escaped = $conexion->real_escape_string($password_nueva);
$sql_update = "UPDATE usuario SET password = '$password_escaped' WHERE id = $usuario_id";

if ($conexion->query($sql_update)) {
    
    //REGISTRAR LOG
    $max = $conexion->query("SELECT MAX(id) as m FROM logs_seguridad")->fetch_assoc()['m'] ?? 0;
    $nombre = $conexion->real_escape_string($usuario['nombre']);
    $conexion->query("INSERT INTO logs_seguridad VALUES (" . ($max+1) . ", $usuario_id, 'cambio_password', 'Cambio de contraseña de $nombre', 'medio', '0.0.0.0', NOW())");
    
    echo json_encode(["success" => true, "message" => "Contraseña actualizada correctamente"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al actualizar: " . $conexion->error]);
}
?>