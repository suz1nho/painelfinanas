<?php

session_start();
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode([]);
    exit;
}
$usuario_id = $_SESSION['usuario_id'];

require 'db.php';

$mes = $_GET['mes'] ?? '';

if (!$mes) {
    http_response_code(400);
    echo json_encode([]);
    exit;
}

$sql = "SELECT * FROM transacoes WHERE mes = ? AND usuario_id = ? ORDER BY data DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute([$mes, $usuario_id]);




$transacoes = $stmt->fetchAll();

header('Content-Type: application/json');
echo json_encode($transacoes);
