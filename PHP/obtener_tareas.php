<?php
include 'conexion.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");

$usuario_id = $_GET['usuario_id'] ?? '';

$sql = "SELECT * FROM tareas WHERE usuario_id = '$usuario_id' ORDER BY fecha_creacion DESC";
$resultado = $conexion->query($sql);

$tareas = [];
while($fila = $resultado->fetch_assoc()) {
    //Obtener etiquetas de esta tarea
    $tarea_id = $fila['id'];
    $sql_etiquetas = "SELECT e.* FROM etiquetas e 
                      INNER JOIN tarea_etiqueta te ON e.id = te.etiqueta_id 
                      WHERE te.tarea_id = $tarea_id";
    $resultado_etiquetas = $conexion->query($sql_etiquetas);
    
    $etiquetas = [];
    while($etiqueta = $resultado_etiquetas->fetch_assoc()) {
        $etiquetas[] = $etiqueta;
    }
    
    $fila['etiquetas'] = $etiquetas;
    $tareas[] = $fila;
}

echo json_encode(["success" => true, "tareas" => $tareas]);
?>