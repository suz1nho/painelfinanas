<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = $_POST['nome'] ?? '';
    $email = $_POST['email'] ?? '';
    $senha = $_POST['senha'] ?? '';

    if (!$nome || !$email || !$senha) {
        die('Preencha todos os campos!');
    }

    $check = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
    $check->execute([$email]);

    if ($check->rowCount() > 0) {
        die('E-mail já cadastrado!');
    }

    $senhaHash = password_hash($senha, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)");
    if ($stmt->execute([$nome, $email, $senhaHash])) {
        // ✅ Redirecionar para login
        header('Location: index.html');
        exit;
    } else {
        die('Erro ao cadastrar usuário');
    }
} else {
    die('Método não permitido');
}
