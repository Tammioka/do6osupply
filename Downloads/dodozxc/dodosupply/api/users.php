<?php
require 'db.php';
header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT id, username, role, status FROM users");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} elseif ($method === 'POST') {
    $action = $_POST['action'] ?? $input['action'] ?? '';
    
    if ($action === 'delete') {
        $pdo->prepare("DELETE FROM users WHERE id = ?")->execute([$input['id']]);
        echo json_encode(["success" => true]);
        exit;
    }
    
    $id = $input['id'] ?? 'USR-' . rand(1000, 9999);
    $username = $input['username'];
    $role = $input['role'];
    $status = $input['status'];
    $password = $input['password'] ?? '';

    $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
    $stmt->execute([$id]);
    
    if ($stmt->fetch()) {
        if ($password) {
            $upd = $pdo->prepare("UPDATE users SET username=?, password=?, role=?, status=? WHERE id=?");
            $upd->execute([$username, $password, $role, $status, $id]);
        } else {
            $upd = $pdo->prepare("UPDATE users SET username=?, role=?, status=? WHERE id=?");
            $upd->execute([$username, $role, $status, $id]);
        }
    } else {
        $ins = $pdo->prepare("INSERT INTO users (id, username, password, role, status) VALUES (?, ?, ?, ?, ?)");
        $ins->execute([$id, $username, $password, $role, $status]);
    }
    echo json_encode(["success" => true]);
}
?>