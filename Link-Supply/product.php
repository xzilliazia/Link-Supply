<?php

require_once __DIR__ . '/controllers/ProductController.php';

$requestedProductId = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
$productId = is_int($requestedProductId) ? $requestedProductId : null;

(new ProductController())->show($productId);
