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

$tarea_id = $data['tarea_id'] ?? null;
$etiqueta_id = $data['etiqueta_id'] ?? null;

if (!$tarea_id || !$etiqueta_id) {
    echo json_encode(["success" => false, "error" => "Datos incompletos"]);
    exit;
}

//Verificar si ya existe
$check = $conexion->query("SELECT * FROM tarea_etiqueta WHERE tarea_id = $tarea_id AND etiqueta_id = $etiqueta_id");
if ($check->num_rows > 0) {
    echo json_encode(["success" => false, "error" => "Etiqueta ya asignada"]);
    exit;
}

//Calcular ID
$resultado = $conexion->query("SELECT MAX(id) as max_id FROM tarea_etiqueta");
$fila = $resultado->fetch_assoc();
$nuevo_id = ($fila['max_id'] ?? 0) + 1;

$sql = "INSERT INTO tarea_etiqueta (id, tarea_id, etiqueta_id) 
        VALUES ($nuevo_id, $tarea_id, $etiqueta_id)";

if ($conexion->query($sql)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $conexion->error]);
}
?>