<?php
require 'db.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

if ($method === 'GET') {
    // Отдаем все закупки, КРОМЕ архива (чтобы не засорять доску)
    $stmt = $pdo->query("SELECT * FROM purchases WHERE status != 'Архив' ORDER BY date DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
} 

if ($method === 'POST') {
    $action = $_POST['action'] ?? $input['action'] ?? 'create';

    if ($action === 'delete') {
        $id = $_POST['id'] ?? $input['id'] ?? '';
        $pdo->prepare("DELETE FROM purchases WHERE id = ?")->execute([$id]);
        echo json_encode(["success" => true]);
        exit;
    }

    // --- ЛОГИКА СМЕНЫ СТАТУСА (И МАТЕМАТИКА СКЛАДА) ---
    if ($action === 'update_status') {
        $id = $_POST['id'] ?? $input['id'] ?? '';
        $newStatus = $_POST['status'] ?? $input['status'] ?? '';

        try {
            $pdo->beginTransaction();
            $stmt = $pdo->prepare("SELECT * FROM purchases WHERE id = ?");
            $stmt->execute([$id]);
            $purchase = $stmt->fetch(PDO::FETCH_ASSOC);
            $oldStatus = $purchase['status'];

            // 1. Обновляем статус закупки
            $pdo->prepare("UPDATE purchases SET status = ? WHERE id = ?")->execute([$newStatus, $id]);

            // 2. Если товар ДОСТАВИЛИ (а раньше не был доставлен) -> ПЛЮСУЕМ НА СКЛАД
            if ($newStatus === 'Доставлен' && $oldStatus !== 'Доставлен') {
                $invStmt = $pdo->prepare("SELECT id, quantity FROM inventory WHERE name = ?");
                $invStmt->execute([$purchase['item']]);
                $inv = $invStmt->fetch(PDO::FETCH_ASSOC);

                if ($inv) {
                    $pdo->prepare("UPDATE inventory SET quantity = quantity + ?, lastUpdated = CURDATE() WHERE id = ?")->execute([$purchase['quantity'], $inv['id']]);
                } else {
                    $invId = 'WH-' . rand(1000, 9999);
                    $pdo->prepare("INSERT INTO inventory (id, name, category, quantity, unit, maxCapacity, criticalLimit, status, lastUpdated) VALUES (?, ?, ?, ?, 'шт', 1000, 100, 'В наличии', CURDATE())")->execute([$invId, $purchase['item'], $purchase['category'], $purchase['quantity']]);
                }
            }
            // 3. Если товар ВЕРНУЛИ из доставленных в ожидается/отменен (ОТКАТ) -> ВЫЧИТАЕМ СО СКЛАДА
            // (В 'Архив' не вычитаем, архив - это просто скрытие доставленного с доски)
            elseif ($oldStatus === 'Доставлен' && ($newStatus === 'Ожидается' || $newStatus === 'Отменен')) {
                $invStmt = $pdo->prepare("SELECT id, quantity FROM inventory WHERE name = ?");
                $invStmt->execute([$purchase['item']]);
                $inv = $invStmt->fetch(PDO::FETCH_ASSOC);

                if ($inv) {
                    // Защита от ухода в минус
                    $newQty = max(0, $inv['quantity'] - $purchase['quantity']);
                    $pdo->prepare("UPDATE inventory SET quantity = ?, lastUpdated = CURDATE() WHERE id = ?")->execute([$newQty, $inv['id']]);
                }
            }

            $pdo->commit();
            echo json_encode(["success" => true]);
        } catch (PDOException $e) {
            $pdo->rollBack();
            http_response_code(500); echo json_encode(["error" => $e->getMessage()]);
        }
        exit;
    } 
    
    // --- ЛОГИКА СОЗДАНИЯ (И ПРЕД-СОЗДАНИЯ НА СКЛАДЕ) ---
    if ($action === 'create') {
        $id = !empty($input['id']) ? $input['id'] : 'ORD-' . rand(1000, 9999);
        $supplier = $input['supplier'] ?? 'Поставщик';
        $item = $input['item'] ?? 'Товар';
        $category = $input['category'] ?? 'Бакалея';
        $qty = intval($input['quantity'] ?? 1);
        $price = intval($input['price'] ?? 0);
        
        try {
            $pdo->beginTransaction();
            
            // Записываем закупку
            $pdo->prepare("INSERT INTO purchases (id, date, supplier, item, category, quantity, price, status) VALUES (?, CURDATE(), ?, ?, ?, ?, ?, 'Ожидается')")->execute([$id, $supplier, $item, $category, $qty, $price]);
            
            // Пред-создание на складе с НУЛЕВЫМ количеством, если товара еще нет
            $invCheck = $pdo->prepare("SELECT id FROM inventory WHERE name = ?");
            $invCheck->execute([$item]);
            if (!$invCheck->fetch()) {
                $invId = 'WH-' . rand(1000, 9999);
                $pdo->prepare("INSERT INTO inventory (id, name, category, quantity, unit, maxCapacity, criticalLimit, status, lastUpdated) VALUES (?, ?, ?, 0, 'шт', 1000, 100, 'В пути', CURDATE())")->execute([$invId, $item, $category]);
            }

            $pdo->commit();
            echo json_encode(["success" => true]);
        } catch (PDOException $e) {
            $pdo->rollBack();
            http_response_code(500); echo json_encode(["error" => $e->getMessage()]);
        }
        exit;
    }
}
?>