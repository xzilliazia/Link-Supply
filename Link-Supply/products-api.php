<?php
header('Content-Type: application/json; charset=utf-8');

$products = require __DIR__ . '/products-data.php';
$response = [
    'success' => true,
    'message' => 'Katalog produk berhasil dimuat.',
    'data' => $products,
];

echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
