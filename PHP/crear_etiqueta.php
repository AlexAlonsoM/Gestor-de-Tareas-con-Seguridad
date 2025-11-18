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
$nombre = $data['nombre'] ?? '';
$color = $data['color'] ?? '#667eea';

if (!$usuario_id || empty(trim($nombre))) {
    echo json_encode(["success" => false, "error" => "Datos incompletos"]);
    exit;
}

// Calcular ID
$resultado = $conexion->query("SELECT MAX(id) as max_id FROM etiquetas");
$fila = $resultado->fetch_assoc();
$nuevo_id = ($fila['max_id'] ?? 0) + 1;

$nombre_escaped = $conexion->real_escape_string($nombre);

$sql = "INSERT INTO etiquetas (id, nombre, color, usuario_id) 
        VALUES ($nuevo_id, '$nombre_escaped', '$color', $usuario_id)";

if ($conexion->query($sql)) {
    echo json_encode(["success" => true, "etiqueta" => [
        "id" => $nuevo_id,
        "nombre" => $nombre,
        "color" => $color,
        "usuario_id" => $usuario_id
    ]]);
} else {
    echo json_encode(["success" => false, "error" => $conexion->error]);
}
?>