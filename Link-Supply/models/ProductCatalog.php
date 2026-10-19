<?php

require_once __DIR__ . '/Product.php';

final class ProductCatalog
{
    private array $products = [];

    public function __construct()
    {
        $dataPath = __DIR__ . '/../data/products.json';
        $json = file_get_contents($dataPath);

        if ($json === false) {
            throw new RuntimeException("Unable to read product catalog: {$dataPath}");
        }

        $productRows = json_decode($json, true, 512, JSON_THROW_ON_ERROR);
        if (!is_array($productRows) || !array_is_list($productRows)) {
            throw new UnexpectedValueException('Product catalog must contain a JSON list.');
        }

        foreach ($productRows as $productRow) {
            if (!is_array($productRow)) {
                throw new UnexpectedValueException('Each catalog entry must be a product object.');
            }

            $product = Product::fromArray($productRow);
            if (isset($this->products[$product->getId()])) {
                throw new UnexpectedValueException("Duplicate product ID: {$product->getId()}");
            }

            $this->products[$product->getId()] = $product;
        }
    }

    public function all(): array
    {
        return array_values($this->products);
    }

    public function findById(int $id): ?Product
    {
        return $this->products[$id] ?? null;
    }
}
