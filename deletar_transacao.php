<?php

session_start();
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo "Não autorizado.";
    exit;
}
$usuario_id = $_SESSION['usuario_id'];

$id = $_POST['id'] ?? '';

$sql = "DELETE FROM transacoes WHERE id = ? AND usuario_id = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$id, $usuario_id]);

require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? '';

    if (!$id) {
        http_response_code(400);
        echo "ID da transação é obrigatório.";
        exit;
    }

    $sql = "DELETE FROM transacoes WHERE id = ?";
    $stmt = $pdo->prepare($sql);

    try {
        $stmt->execute([$id]);
        echo "Transação deletada com sucesso!";
    } catch (Exception $e) {
        http_response_code(500);
        echo "Erro ao deletar transação: " . $e->getMessage();
    }
} else {
    http_response_code(405);
    echo "Método não permitido.";
}
