<?php
require 'db.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM suppliers ORDER BY id DESC");
    $suppliers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($suppliers as &$supplier) {
        if ($supplier['image'] && strpos($supplier['image'], 'http') === false) {
            $supplier['image'] = 'http://localhost:8000/' . $supplier['image'];
        }
    }
    echo json_encode($suppliers);
    exit;
} 

if ($method === 'POST') {
    if (isset($_POST['action']) && $_POST['action'] === 'delete') {
        try {
            $pdo->prepare("DELETE FROM suppliers WHERE id = ?")->execute([$_POST['id']]);
            echo json_encode(["success" => true]);
        } catch (PDOException $e) {
            http_response_code(500); echo json_encode(["error" => $e->getMessage()]);
        }
        exit;
    }

    $id = !empty($_POST['id']) ? $_POST['id'] : 'SUP-' . rand(1000, 9999);
    $name = $_POST['name'] ?? 'Новый поставщик';
    $category = $_POST['category'] ?? 'Разное';
    $rating = $_POST['rating'] ?? 0.0;
    $phone = $_POST['phone'] ?? '';
    $email = $_POST['email'] ?? '';
    $status = $_POST['status'] ?? 'Активен';
    
    // ВАЖНО: принимаем каталог товаров
    $catalog = $_POST['catalog'] ?? '[]'; 
    $imagePath = '';

    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);
        $fileName = time() . '_' . basename($_FILES['image']['name']);
        if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $fileName)) {
            $imagePath = $uploadDir . $fileName;
        }
    }

    try {
        $check = $pdo->prepare("SELECT id FROM suppliers WHERE id = ?");
        $check->execute([$id]);
        
        if ($check->fetch()) {
            if ($imagePath !== '') {
                // Сохраняем ВМЕСТЕ с картинкой и КАТАЛОГОМ
                $upd = $pdo->prepare("UPDATE suppliers SET name=?, category=?, rating=?, phone=?, email=?, status=?, catalog=?, image=? WHERE id=?");
                $upd->execute([$name, $category, $rating, $phone, $email, $status, $catalog, $imagePath, $id]);
            } else {
                // Обновляем БЕЗ картинки, но С КАТАЛОГОМ
                $upd = $pdo->prepare("UPDATE suppliers SET name=?, category=?, rating=?, phone=?, email=?, status=?, catalog=? WHERE id=?");
                $upd->execute([$name, $category, $rating, $phone, $email, $status, $catalog, $id]);
            }
        } else {
            $ins = $pdo->prepare("INSERT INTO suppliers (id, name, category, rating, phone, email, status, catalog, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $ins->execute([$id, $name, $category, $rating, $phone, $email, $status, $catalog, $imagePath]);
        }
        echo json_encode(["success" => true]);
    } catch (PDOException $e) {
        http_response_code(500); echo json_encode(["error" => "Ошибка SQL: " . $e->getMessage()]);
    }
}
?>