# Laravel architecture

Link-Supply is being migrated from a static/procedural storefront into a Laravel application. The existing browser UI is retained as a presentation layer and is not a specification for production commerce functionality.

## Request flow

### Product pages

`routes/web.php` dispatches the catalog and product detail URLs to controllers. `ProductCatalog` owns product reads and eager-loads the `category` relationship. Controllers pass Eloquent models to Blade; the templates render HTML and use `Js::from` when bootstrapping browser data.

### Product API

`ProductIndexRequest` validates optional category, province, and search filters. `ProductCatalog::search()` applies those filters to Eloquent queries. `ProductResource` maps model data to the existing camelCase JSON contract consumed by the JavaScript UI.

### Order API

`StoreOrderRequest` validates the submitted order. `CheckoutController` delegates to `CreateOrderAction`, which re-reads prices and stock from the database and writes an order, its item snapshots, and inventory changes in one transaction. `OrderResource` defines the response shape. This is a learning implementation; payment methods are labels only and no payment is processed.

## Persistence

- `Product` belongs to `Category`; `Category` has many products.
- `Order` has many `OrderItem` records; each item belongs to a product.
- Migrations own schema changes. `ProductSeeder` imports the sample JSON catalog and uses upserts so it can be run repeatedly.
- Tests use an in-memory SQLite database through `php artisan test`.

## Code boundaries

- Controllers coordinate HTTP requests and responses.
- Form Requests validate inbound values.
- Resources serialize API/frontend data instead of model-specific `toArray()` methods.
- Blade templates render HTML; presentation markup does not live in PHP support classes or Eloquent models.
- Models contain persistence concerns, relationships, fillable attributes, and casts.
- `ProductCatalog` groups reusable catalog queries; `CreateOrderAction` owns the transactional order operation.

## Local development

Use PHP 8.4.1 or newer with the committed lockfile. In Laragon, set the virtual host document root to this repository's `public` directory. The local SQLite database is configured in `.env`; `php artisan migrate --seed` applies schema and loads the sample catalog. See the root README for full setup commands.

## Deliberately outside the current scope

- Customer or administrator authentication and authorization
- Product administration UI
- Payment provider integration or payment capture
- Production order fulfillment workflows

These can be added later as separate Laravel features with their own routes, policies, requests, actions, and tests.
