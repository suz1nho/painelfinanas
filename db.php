<?php
// db.php
$host = 'sql204.infinityfree.com';      // ou IP do servidor MySQL
$db   = 'if0_39544008_financas';     // nome do banco
$user = 'if0_39544008';           // usuário MySQL
$pass = 'h3tzQvDmtgl';               // senha MySQL

$dsn = "mysql:host=$host;dbname=$db";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     http_response_code(500);
     echo "Erro de conexão com banco de dados: " . $e->getMessage();
     exit;
}
?>
