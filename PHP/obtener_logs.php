<?php
include 'conexion.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");

$usuario_id = $_GET['usuario_id'] ?? '';

//Obtener los logs de seguridad del usuario
$sql = "SELECT * FROM logs_seguridad WHERE usuario_id = '$usuario_id' ORDER BY fecha_evento DESC LIMIT 50";
$resultado = $conexion->query($sql);

//Recorrer cada fila y agregarla al array de logs
$logs = [];
while($fila = $resultado->fetch_assoc()) {
    $logs[] = $fila;
}

//Devolver respuesta JSON
echo json_encode(["success" => true, "logs" => $logs]);
?>