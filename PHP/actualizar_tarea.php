<?php
include 'conexion.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: PUT, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Manejar preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;
$titulo = $data['titulo'] ?? null;
$descripcion = $data['descripcion'] ?? '';
$categoria = $data['categoria'] ?? 'General';
$prioridad = $data['prioridad'] ?? 'media';
$estado = $data['estado'] ?? 'pendiente';
$fecha_limite = $data['fecha_limite'] ?? null;

// Validación
if (!$id) {
    echo json_encode(["success" => false, "error" => "ID no especificado"]);
    exit;
}

if (empty($titulo)) {
    echo json_encode(["success" => false, "error" => "El título es obligatorio"]);
    exit;
}

// Limpiar fecha_limite si está vacía
if (empty($fecha_limite)) {
    $fecha_limite = null;
}

// Si se marca como completada, agregar fecha de completado
$fecha_completado_sql = "NULL";
if ($estado === 'completada') {
    $fecha_completado_sql = "NOW()";
}

$sql = "UPDATE tareas SET 
        titulo = '$titulo',
        descripcion = '$descripcion',
        categoria = '$categoria',
        prioridad = '$prioridad',
        estado = '$estado',
        fecha_limite = " . ($fecha_limite ? "'$fecha_limite'" : "NULL") . ",
        fecha_completado = $fecha_completado_sql
        WHERE id = '$id'";

if ($conexion->query($sql)) {
    echo json_encode(["success" => true, "message" => "Tarea actualizada"]);
} else {
    echo json_encode(["success" => false, "error" => $conexion->error]);
}
?>