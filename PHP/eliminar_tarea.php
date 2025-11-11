<?php
include 'conexion.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

//Obtener datos JSON
$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];
$usuario_id = $data['usuario_id'] ?? null; // ← NECESITAMOS EL USUARIO

//Obtener info de la tarea antes de eliminar
$sql_tarea = "SELECT titulo FROM tareas WHERE id = '$id'";
$resultado_tarea = $conexion->query($sql_tarea);
$tarea = $resultado_tarea->fetch_assoc();
$titulo_tarea = $tarea['titulo'] ?? 'Tarea desconocida';    //Titulo o valor por defecto

//Eliminar tarea
$sql = "DELETE FROM tareas WHERE id = '$id'";

//Ejecutar la eliminacion
if ($conexion->query($sql)) {
    
    //REGISTRAR LOG
    if ($usuario_id) {
        $resultado_log = $conexion->query("SELECT MAX(id) as max_id FROM logs_seguridad");
        $fila_log = $resultado_log->fetch_assoc();
        $nuevo_id_log = ($fila_log['max_id'] ?? 0) + 1;
        
        $ip_address = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

        //Crear descripcion del log (longitud del titulo)
        $descripcion_log = "Tarea eliminada: " . substr($titulo_tarea, 0, 50);
        
        $sql_log = "INSERT INTO logs_seguridad (id, usuario_id, tipo_evento, descripcion, nivel_severidad, ip_address) 
                    VALUES ('$nuevo_id_log', '$usuario_id', 'tarea_eliminada', '$descripcion_log', 'medio', '$ip_address')";
        
        $conexion->query($sql_log);
    }
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $conexion->error]);
}
?>