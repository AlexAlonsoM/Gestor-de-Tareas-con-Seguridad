<?php
include 'conexion.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");

$usuario_id = $_GET['usuario_id'];

$sql = "SELECT * FROM etiquetas WHERE usuario_id = '$usuario_id' ORDER BY nombre ASC";
$resultado = $conexion->query($sql);

$etiquetas = [];
while($fila = $resultado->fetch_assoc()) {
    $etiquetas[] = $fila;
}

echo json_encode(["success" => true, "etiquetas" => $etiquetas]);
?>