<?php
require 'db.php';
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$username = $input['username'] ?? '';
$password = $input['password'] ?? '';

if (!$username || !$password) {
    echo json_encode(["success" => false, "error" => "Пустые данные"]);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Для продакшена используйте password_verify($password, $user['password'])
// Если вы сохранили пароль в БД текстом, используйте == (небезопасно, но для тестов пойдет)
if ($user && $user['password'] === $password && $user['status'] === 'Активен') {
    // Не отправляем пароль на фронт
    unset($user['password']);
    echo json_encode(["success" => true, "user" => $user]);
} else {
    echo json_encode(["success" => false, "error" => "Неверный логин, пароль или аккаунт заблокирован"]);
}
?>