<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

final class ProductCatalog
{
    /**
     * @return Collection<int, Product>
     */
    public function all(): Collection
    {
        return $this->search();
    }

    /**
     * @param  array{category?: string, province?: string, search?: string}  $filters
     * @return Collection<int, Product>
     */
    public function search(array $filters = []): Collection
    {
        return Product::query()
            ->with('category')
            ->when(
                $filters['category'] ?? null,
                fn (Builder $query, string $category): Builder => $query->whereHas(
                    'category',
                    fn (Builder $categoryQuery): Builder => $categoryQuery->where('slug', $category)
                )
            )
            ->when(
                $filters['province'] ?? null,
                fn (Builder $query, string $province): Builder => $query->where('province', $province)
            )
            ->when(
                $filters['search'] ?? null,
                fn (Builder $query, string $search): Builder => $query->where(function (Builder $query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%");
                })
            )
            ->orderBy('id')
            ->get();
    }

    public function findById(int $id): ?Product
    {
        return Product::query()->with('category')->find($id);
    }
}
