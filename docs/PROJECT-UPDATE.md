# Link-Supply project update

Updated: 2026-11-14

This file summarizes the Laravel migration work completed so far. The goal is a maintainable Laravel MVC/OOP learning project; a production-ready commerce site is out of scope for now.

## Laravel architecture updates

- Product and category data is stored in SQLite and modeled with Eloquent. `Product` belongs to `Category`, and `Category` has many products.
- A migration backfilled existing product categories into the relational schema. The configured database was migrated without resetting or reseeding it; it retained 24 products and 4 categories.
- `ProductCatalog` owns shared catalog queries and eager-loads categories. `ProductIndexRequest` validates API filters.
- `ProductResource` defines the frontend JSON shape. Product serialization helpers were removed from the model.
- Product pages render through Blade. The old PHP classes that rendered HTML and formatted view data were removed.
- Models use explicit fillable fields. Lazy loading is prevented outside production to help reveal missing eager loads during development and tests.
- Order creation is organized as a transaction action, with request validation, server-side price and stock checks, and Eloquent order relationships. It is a prototype only: no payment provider or authentication is integrated.

## Project setup and documentation

- Composer metadata now identifies Link-Supply, requires PHP `^8.4.1` to match the locked dependencies, and pins Laravel Boost to `^2.10`.
- Laravel Boost skills were installed without replacing the existing root `AGENTS.md` instructions.
- The root README now documents Laragon setup and requires the virtual host document root to point to the project's `public` directory.
- `docs/ARCHITECTURE.md` documents the current code boundaries. `docs/FEATURES.md` was updated where its architecture descriptions had become outdated.

## Verification

- `php artisan test`: **12 passed, 48 assertions**.
- Pint formatting check: passed.
- `composer validate --no-check-publish`: passed.
- `composer check-platform-reqs --lock`: passed under PHP 8.5.12.
- `npm install`: completed with 0 reported vulnerabilities.
- `npm run build`: succeeded. Vite printed a non-blocking note that optional `fontaine` is absent.
- All migrations are applied to the configured local SQLite database.

## Laragon SQLite driver fix

The Laragon PHP 8.5.12 configuration had `pdo_sqlite` and `sqlite3` disabled. Both extensions are now enabled in:

`C:\laragon\bin\php\php-8.5.12-1-Win32-vs17-x64\php.ini`

Laragon's PHP CLI was checked and reports both extensions loaded. Restart Apache in Laragon so the web server loads the updated configuration, then refresh `http://link-supply.test`.

## Running locally

From PowerShell:

```powershell
cd C:\laragon\www\Link-Supply
composer install
npm install
php artisan migrate
npm run build
```

Run `php artisan db:seed` only when sample catalog data needs to be loaded or restored. The seeder reapplies sample prices and stock for matching product IDs. For Laragon, point the virtual host to `C:\laragon\www\Link-Supply\public`. Alternatively, run `php artisan serve` and visit `http://127.0.0.1:8000`.

## Remaining architecture work

- Audit the legacy browser assets under `public` and `src` against the Vite entry points under `resources`; the current pages still load legacy `public` assets while Vite builds from `resources`.
- Continue adding focused tests for model relationships, validation, and order transaction failure cases as Laravel behavior is migrated.
- Add authentication, authorization, administration, or real payment integrations only when those are in scope.
