<?php
// Разрешаем запросы от React (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Заглушка для браузерных preflight-запросов
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$host = '127.0.0.1';
$db   = 'dodo_supply';
$user = 'root'; // Стандартный логин phpMyAdmin
$pass = '';     // Пароль обычно пустой

try {
    // Создаем то самое подключение $pdo
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["error" => "Ошибка подключения к БД: " . $e->getMessage()]));
}
?>