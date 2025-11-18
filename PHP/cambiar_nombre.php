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
$nuevo_nombre = $data['nuevo_nombre'] ?? '';

if (!$usuario_id || empty(trim($nuevo_nombre))) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit();
}

$nuevo_nombre_escaped = $conexion->real_escape_string($nuevo_nombre);
$sql_update = "UPDATE usuario SET nombre = '$nuevo_nombre_escaped' WHERE id = $usuario_id";

if ($conexion->query($sql_update)) {
    
    //REGISTRAR LOG
    $max = $conexion->query("SELECT MAX(id) as m FROM logs_seguridad")->fetch_assoc()['m'] ?? 0;
    $conexion->query("INSERT INTO logs_seguridad VALUES (" . ($max+1) . ", $usuario_id, 'cambio_nombre', 'Cambio de nombre a: $nuevo_nombre_escaped', 'bajo', '0.0.0.0', NOW())");
    
    echo json_encode(["success" => true, "message" => "Nombre actualizado correctamente"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al actualizar: " . $conexion->error]);
}
?>