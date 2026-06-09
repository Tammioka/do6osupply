<?php
require 'db.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM inventory ORDER BY lastUpdated DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} 
elseif ($method === 'POST') {
    $action = $_POST['action'] ?? $input['action'] ?? 'save';

    if ($action === 'delete') {
        $id = $_POST['id'] ?? $input['id'] ?? '';
        $pdo->prepare("DELETE FROM inventory WHERE id = ?")->execute([$id]);
        echo json_encode(["success" => true]);
        exit;
    }

    // Ручное добавление/редактирование склада
    $id = $input['id'] ?? 'WH-' . rand(1000, 9999);
    $name = $input['name'] ?? 'Новый товар';
    $category = $input['category'] ?? 'Сырье';
    $quantity = intval($input['quantity'] ?? 0);
    $unit = $input['unit'] ?? 'шт';
    $maxCapacity = intval($input['maxCapacity'] ?? 1000);
    $criticalLimit = intval($input['criticalLimit'] ?? 100);

    // Если такой ID есть - обновляем, если нет - создаем
    $stmt = $pdo->prepare("SELECT id FROM inventory WHERE id = ?");
    $stmt->execute([$id]);
    
    if ($stmt->fetch()) {
        $upd = $pdo->prepare("UPDATE inventory SET name=?, category=?, quantity=?, unit=?, maxCapacity=?, criticalLimit=?, lastUpdated=CURDATE() WHERE id=?");
        $upd->execute([$name, $category, $quantity, $unit, $maxCapacity, $criticalLimit, $id]);
    } else {
        $ins = $pdo->prepare("INSERT INTO inventory (id, name, category, quantity, unit, maxCapacity, criticalLimit, status, lastUpdated) VALUES (?, ?, ?, ?, ?, ?, ?, 'В наличии', CURDATE())");
        $ins->execute([$id, $name, $category, $quantity, $unit, $maxCapacity, $criticalLimit]);
    }
    echo json_encode(["success" => true]);
}
?>