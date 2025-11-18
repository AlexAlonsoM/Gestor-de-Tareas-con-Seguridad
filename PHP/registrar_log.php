<?php
include 'conexion.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$usuario_id = $data['usuario_id'] ?? null;
$nombre = $data['nombre'] ?? 'Usuario';

if (!$usuario_id) {
    echo json_encode(["success" => false]);
    exit;
}

// Registrar logout
$resultado = $conexion->query("SELECT MAX(id) as max_id FROM logs_seguridad");
$fila = $resultado->fetch_assoc();
$nuevo_id = ($fila['max_id'] ?? 0) + 1;

$ip_address = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

$sql = "INSERT INTO logs_seguridad (id, usuario_id, tipo_evento, descripcion, nivel_severidad, ip_address) 
        VALUES ('$nuevo_id', '$usuario_id', 'sesion_cerrada', 'Cierre de sesión de $nombre', 'bajo', '$ip_address')";

if ($conexion->query($sql)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false]);
}
?>