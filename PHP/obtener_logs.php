<?php
include 'conexion.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");

$usuario_id = $_GET['usuario_id'] ?? '';

$sql = "SELECT * FROM logs_seguridad WHERE usuario_id = '$usuario_id' ORDER BY fecha_evento DESC LIMIT 50";
$resultado = $conexion->query($sql);

$logs = [];
while($fila = $resultado->fetch_assoc()) {
    $logs[] = $fila;
}

echo json_encode(["success" => true, "logs" => $logs]);
?>