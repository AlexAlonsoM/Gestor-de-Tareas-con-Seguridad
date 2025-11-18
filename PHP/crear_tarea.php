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
$titulo = $data['titulo'] ?? null;
$descripcion = $data['descripcion'] ?? '';
$categoria = $data['categoria'] ?? 'General';
$prioridad = $data['prioridad'] ?? 'media';
$fecha_limite = $data['fecha_limite'] ?? null;

// Validación
if (!$usuario_id) {
    echo json_encode(["success" => false, "error" => "Usuario no especificado"]);
    exit;
}

if (empty($titulo) || trim($titulo) === '') {
    echo json_encode(["success" => false, "error" => "El título es obligatorio"]);
    exit;
}

// Calcular ID manualmente
$resultado = $conexion->query("SELECT MAX(id) as max_id FROM tareas");
$fila = $resultado->fetch_assoc();
$nuevo_id = ($fila['max_id'] ?? 0) + 1;

// Limpiar fecha_limite si está vacía
if (empty($fecha_limite)) {
    $fecha_limite = null;
}

$sql = "INSERT INTO tareas (id, usuario_id, titulo, descripcion, categoria, prioridad, fecha_limite) 
        VALUES ('$nuevo_id', '$usuario_id', '$titulo', '$descripcion', '$categoria', '$prioridad', " . 
        ($fecha_limite ? "'$fecha_limite'" : "NULL") . ")";

if ($conexion->query($sql)) {
    
    // ==================== REGISTRAR LOG ====================
    
    // Si es CRÍTICA, registrar con nivel ALTO
    $nivel_severidad = ($prioridad === 'critica') ? 'alto' : 'bajo';
    $tipo_evento = ($prioridad === 'critica') ? 'tarea_critica' : 'tarea_creada';
    $descripcion_log = "Tarea creada: " . substr($titulo, 0, 50);
    
    // Registrar en logs
    $resultado_log = $conexion->query("SELECT MAX(id) as max_id FROM logs_seguridad");
    $fila_log = $resultado_log->fetch_assoc();
    $nuevo_id_log = ($fila_log['max_id'] ?? 0) + 1;
    
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    
    $sql_log = "INSERT INTO logs_seguridad (id, usuario_id, tipo_evento, descripcion, nivel_severidad, ip_address) 
                VALUES ('$nuevo_id_log', '$usuario_id', '$tipo_evento', '$descripcion_log', '$nivel_severidad', '$ip_address')";
    
    $conexion->query($sql_log);
    
    // Devolver tarea creada
    $tarea_sql = "SELECT * FROM tareas WHERE id = '$nuevo_id'";
    $tarea_result = $conexion->query($tarea_sql);
    $tarea = $tarea_result->fetch_assoc();
    
    echo json_encode(["success" => true, "tarea" => $tarea]);
} else {
    echo json_encode(["success" => false, "error" => $conexion->error]);
}
?>