<?php
include 'conexion.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");

$usuario_id = $_GET['usuario_id'] ?? '';

//Obtener todas las tareas del usuario
$sql = "SELECT * FROM tareas WHERE usuario_id = '$usuario_id' ORDER BY fecha_creacion DESC";
$resultado = $conexion->query($sql);

$tareas = [];
while($fila = $resultado->fetch_assoc()) {
    $tareas[] = $fila;
}

//Devolver JSON y el array de tareas
echo json_encode(["success" => true, "tareas" => $tareas]);
?>