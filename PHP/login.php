<?php
// ACTIVAR ERRORES PARA DEBUG
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'conexion.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Manejar OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Obtener datos
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "No se recibieron datos", "debug" => $input]);
    exit();
}

$email = isset($data['email']) ? $data['email'] : '';
$password = isset($data['password']) ? $data['password'] : '';

// Validación
if (empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Email o contraseña vacíos"]);
    exit();
}

// Buscar usuario
$email_escaped = $conexion->real_escape_string($email);
$sql = "SELECT * FROM usuario WHERE correo = '$email_escaped'";
$resultado = $conexion->query($sql);

if (!$resultado) {
    echo json_encode(["success" => false, "message" => "Error en BD: " . $conexion->error]);
    exit();
}

if ($resultado->num_rows > 0) {
    $usuario = $resultado->fetch_assoc();
    
    // Verificar contraseña
    if ($password === $usuario['password']) {
        
        // ==================== REGISTRAR LOGIN EXITOSO ====================
        $resultado_max = $conexion->query("SELECT MAX(id) as max_id FROM logs_seguridad");
        $fila_max = $resultado_max->fetch_assoc();
        $nuevo_id = ($fila_max['max_id'] ?? 0) + 1;
        
        $usuario_id = $usuario['id'];
        $nombre = $conexion->real_escape_string($usuario['nombre']);
        $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        
        $conexion->query("INSERT INTO logs_seguridad (id, usuario_id, tipo_evento, descripcion, nivel_severidad, ip_address) 
                          VALUES ($nuevo_id, $usuario_id, 'login_exitoso', 'Inicio de sesión exitoso de $nombre', 'bajo', '$ip')");
        
        // ✅ LOGIN EXITOSO
        echo json_encode([
            "success" => true,
            "user" => [
                "id" => $usuario['id'],
                "name" => $usuario['nombre'],
                "email" => $usuario['correo']
            ]
        ]);
        
    } else {
        
        // ==================== REGISTRAR LOGIN FALLIDO ====================
        $resultado_max = $conexion->query("SELECT MAX(id) as max_id FROM logs_seguridad");
        $fila_max = $resultado_max->fetch_assoc();
        $nuevo_id = ($fila_max['max_id'] ?? 0) + 1;
        
        $usuario_id = $usuario['id'];
        $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        
        $conexion->query("INSERT INTO logs_seguridad (id, usuario_id, tipo_evento, descripcion, nivel_severidad, ip_address) 
                          VALUES ($nuevo_id, $usuario_id, 'login_fallido', 'Intento de login fallido para $email', 'medio', '$ip')");
        
        // ❌ CONTRASEÑA INCORRECTA
        echo json_encode([
            "success" => false, 
            "message" => "Contraseña incorrecta"
        ]);
    }
} else {
    // ❌ USUARIO NO ENCONTRADO
    echo json_encode([
        "success" => false, 
        "message" => "Usuario no encontrado"
    ]);
}

exit();
?>