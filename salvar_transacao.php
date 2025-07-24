<?php
require 'db.php';

session_start();
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo "Não autorizado.";
    exit;
}
$usuario_id = $_SESSION['usuario_id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $tipo = $_POST['tipo'] ?? '';
    $valor = $_POST['valor'] ?? '';
    $categoria = $_POST['categoria'] ?? '';
    $descricao = $_POST['descricao'] ?? '';
    $data = $_POST['data'] ?? '';
    $mes = $_POST['mes'] ?? '';

    // Validação básica
    if (!$tipo || !$valor || !$categoria || !$descricao || !$data || !$mes) {
        http_response_code(400);
        echo "Dados incompletos.";
        exit;
    }

$sql = "INSERT INTO transacoes (usuario_id, tipo, valor, categoria, descricao, data, mes) VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $pdo->prepare($sql);
$stmt->execute([$usuario_id, $tipo, $valor, $categoria, $descricao, $data, $mes]);


    try {
        $stmt->execute([$tipo, $valor, $categoria, $descricao, $data, $mes]);
        echo "Transação salva com sucesso!";
    } catch (Exception $e) {
        http_response_code(500);
        echo "Erro ao salvar transação: " . $e->getMessage();
    }
} else {
    http_response_code(405);
    echo "Método não permitido.";
}
