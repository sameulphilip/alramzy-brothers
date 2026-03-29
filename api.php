<?php
/**
 * API لتخزين وقراءة بيانات الموقع من السيرفر (بدلاً من الكاش)
 * GET ?action=load  → إرجاع كل البيانات
 * POST action=save  → حفظ المنتجات، الفئات، الماركات، اتصل بنا، السجل
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$dataDir = __DIR__ . '/data';
$storeFile = $dataDir . '/store.json';

if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

function readStore($file) {
    if (!file_exists($file)) {
        return [
            'products' => [],
            'categories' => [],
            'brands' => [],
            'contact' => [],
            'audit' => []
        ];
    }
    $raw = file_get_contents($file);
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        return [
            'products' => [],
            'categories' => [],
            'brands' => [],
            'contact' => [],
            'audit' => []
        ];
    }
    return [
        'products' => isset($data['products']) && is_array($data['products']) ? $data['products'] : [],
        'categories' => isset($data['categories']) && is_array($data['categories']) ? $data['categories'] : [],
        'brands' => isset($data['brands']) && is_array($data['brands']) ? $data['brands'] : [],
        'contact' => isset($data['contact']) && is_array($data['contact']) ? $data['contact'] : [],
        'audit' => isset($data['audit']) && is_array($data['audit']) ? $data['audit'] : []
    ];
}

function writeStore($file, $data) {
    $dir = dirname($file);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    $payload = [
        'products' => isset($data['products']) && is_array($data['products']) ? $data['products'] : [],
        'categories' => isset($data['categories']) && is_array($data['categories']) ? $data['categories'] : [],
        'brands' => isset($data['brands']) && is_array($data['brands']) ? $data['brands'] : [],
        'contact' => isset($data['contact']) && is_array($data['contact']) ? $data['contact'] : [],
        'audit' => isset($data['audit']) && is_array($data['audit']) ? $data['audit'] : []
    ];
    $json = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    return file_put_contents($file, $json) !== false;
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'load') {
    echo json_encode(readStore($storeFile), JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Invalid JSON']);
        exit;
    }
    $action = isset($data['action']) ? $data['action'] : '';
    if ($action !== 'save') {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'action=save required']);
        exit;
    }
    if (writeStore($storeFile, $data)) {
        echo json_encode(['ok' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'Could not write file']);
    }
    exit;
}

http_response_code(400);
echo json_encode(['ok' => false, 'error' => 'Use GET ?action=load or POST with action=save']);
