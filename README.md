# Link-Supply

Link-Supply is a Laravel learning project migrating a storefront prototype into Laravel MVC and Eloquent conventions. The current UI is retained as a frontend reference; the application code is organized around Laravel routes, controllers, form requests, resources, models, and database migrations.

This is a prototype. Orders can be recorded for learning and testing, but there is no real payment gateway, customer authentication, or administration area.

## Requirements

- PHP 8.4.1 or newer (the committed dependency lock currently requires it)
- Composer 2
- Node.js and npm, for building frontend assets
- Laragon is supported for local Windows development

## Setup in Laragon

1. Open the project in Laragon and make sure the web server uses the `public` directory as its document root. Laravel's `.env`, source code, and dependencies must remain outside the web root.
2. Install dependencies from the project root:

   ```sh
   composer install
   npm install
   ```

3. Create `.env` from `.env.example` if it does not already exist, then generate an application key:

   ```sh
   php artisan key:generate
   ```

4. Apply migrations and load the sample catalog:

   ```sh
   php artisan migrate --seed
   ```

5. Build the frontend assets:

   ```sh
   npm run build
   ```

`ProductSeeder` re-applies the sample data for matching product IDs, including their prices and stock. Run `php artisan migrate --seed` only against a local development database where restoring those sample values is expected.

With Laragon auto virtual hosts, open the project host configured for this repository. For a quick alternative, run `php artisan serve` and open `http://127.0.0.1:8000`.

The default example database uses SQLite at `database/database.sqlite`. Set `DB_CONNECTION`, `DB_DATABASE`, and the other database values in `.env` if you prefer a Laragon MySQL database. The committed `.env.example` is safe to copy; do not commit `.env`.

## Useful commands

```sh
php artisan test
php artisan route:list
php artisan migrate:status
```

## Laravel structure

- `routes/web.php` and `routes/api.php` define the application endpoints.
- `app/Http/Controllers` handles HTTP input and responses.
- `app/Http/Requests` validates request data.
- `app/Http/Resources` defines API and frontend JSON contracts.
- `app/Models` contains Eloquent models and relationships.
- `app/Services/ProductCatalog.php` centralizes product catalog queries used by the web page and API.
- `app/Actions/CreateOrderAction.php` contains the transactional order operation.
- `database/migrations`, `database/factories`, and `database/seeders` define and populate database-backed data.
- `resources/views` contains Blade pages and partials; `public` contains browser assets.
- `tests/Feature` exercises route responses, catalog behavior, and order behavior against an in-memory SQLite database.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the current Laravel boundaries, and [docs/FEATURES.md](docs/FEATURES.md) for the storefront behavior.
