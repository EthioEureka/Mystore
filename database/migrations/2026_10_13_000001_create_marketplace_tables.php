<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add roles and telegram details to users
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('customer')->after('password')->index(); // customer, shop_owner, admin
            $table->string('phone')->nullable()->after('role');
            $table->unsignedBigInteger('telegram_user_id')->nullable()->unique()->after('phone');
            $table->string('telegram_username')->nullable()->after('telegram_user_id');
            $table->boolean('is_active')->default(true)->after('telegram_username');
        });

        // Categories
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('icon')->nullable(); // Lucide icon name or emoji
            $table->string('image')->nullable();
            $table->integer('display_order')->default(0)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        // Shops
        Schema::create('shops', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('logo')->nullable();
            $table->string('cover_image')->nullable();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            
            // Public contact methods
            $table->string('public_phone')->nullable();
            $table->string('public_telegram_username')->nullable();
            $table->string('public_address')->nullable();
            $table->string('business_hours')->nullable();
            $table->string('contact_method_preference')->default('both'); // phone, telegram, both
            
            // Notes & status
            $table->text('delivery_note')->nullable();
            $table->text('general_instructions')->nullable();
            $table->string('status')->default('pending')->index(); // pending, approved, suspended, rejected
            $table->text('rejection_reason')->nullable();
            $table->text('suspension_reason')->nullable();
            $table->boolean('notifications_enabled')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        // Products
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id')->constrained('shops')->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->string('sku')->nullable();
            $table->decimal('price', 12, 2)->nullable(); // null = price on request
            $table->decimal('sale_price', 12, 2)->nullable();
            $table->string('currency', 10)->default('ETB');
            $table->string('status')->default('published')->index(); // draft, published, hidden, archived
            $table->integer('stock')->default(0); // general stock if no variants
            $table->boolean('has_variants')->default(false);
            $table->boolean('is_featured')->default(false)->index();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['shop_id', 'slug']);
        });

        // Product Images
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('image_path');
            $table->boolean('is_primary')->default(false);
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });

        // Product Variants
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('name'); // e.g. "Size 42 / Red"
            $table->string('sku')->nullable();
            $table->decimal('price', 12, 2)->nullable(); // override product price if set
            $table->integer('stock')->default(0);
            $table->json('attributes')->nullable(); // {"size": "42", "color": "Red"}
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        // Customer Favorites
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->string('session_id')->nullable()->index();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->timestamps();

            $table->index(['user_id', 'product_id']);
            $table->index(['session_id', 'product_id']);
        });

        // Inquiries (Purchase inquiries - NO ONLINE PAYMENTS)
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number')->unique(); // e.g. INQ-2026-000123
            $table->foreignId('shop_id')->constrained('shops')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            
            // Customer contact fields
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('customer_telegram_username')->nullable();
            $table->unsignedBigInteger('customer_telegram_id')->nullable();
            $table->string('preferred_contact_method')->default('either'); // telegram, phone, either
            $table->text('customer_note')->nullable();

            // Immutable snapshots at moment of inquiry
            $table->string('product_name_snapshot');
            $table->string('variant_description_snapshot')->nullable();
            $table->string('product_image_snapshot')->nullable();
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price_snapshot', 12, 2)->nullable();
            $table->decimal('subtotal_snapshot', 12, 2)->nullable();
            $table->string('currency_snapshot', 10)->default('ETB');

            // Status tracking (strictly off-platform workflow)
            $table->string('status')->default('sent')->index(); // sent, viewed, responded, closed, cancelled
            $table->timestamp('viewed_at')->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->text('manager_notes')->nullable();

            $table->timestamps();
        });

        // Inquiry Status History
        Schema::create('inquiry_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inquiry_id')->constrained('inquiries')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('from_status');
            $table->string('to_status');
            $table->string('comment')->nullable();
            $table->timestamps();
        });

        // Inventory Movements
        Schema::create('inventory_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id')->constrained('shops')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete(); // who changed it
            $table->string('type'); // set, add, remove, sale_adjustment
            $table->integer('quantity_before');
            $table->integer('quantity_change');
            $table->integer('quantity_after');
            $table->string('reason')->nullable();
            $table->timestamps();
        });

        // Notifications (in-dashboard & telegram delivery status)
        Schema::create('app_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('shop_id')->nullable()->constrained('shops')->cascadeOnDelete();
            $table->foreignId('inquiry_id')->nullable()->constrained('inquiries')->cascadeOnDelete();
            $table->string('type'); // new_inquiry, inquiry_status_updated, shop_status_updated
            $table->string('title');
            $table->text('message');
            $table->string('action_url')->nullable();
            $table->boolean('is_read')->default(false)->index();
            $table->string('telegram_delivery_status')->nullable(); // pending, sent, failed, skipped
            $table->text('telegram_delivery_error')->nullable();
            $table->timestamp('telegram_delivered_at')->nullable();
            $table->timestamps();
        });

        // Audit Logs (admin & operations)
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action'); // shop_approved, shop_suspended, product_moderated, user_banned
            $table->string('target_type')->nullable(); // Shop, Product, User
            $table->unsignedBigInteger('target_id')->nullable();
            $table->json('details')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();
        });

        // Marketplace Settings
        Schema::create('marketplace_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('marketplace_settings');
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('app_notifications');
        Schema::dropIfExists('inventory_movements');
        Schema::dropIfExists('inquiry_status_histories');
        Schema::dropIfExists('inquiries');
        Schema::dropIfExists('favorites');
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('products');
        Schema::dropIfExists('shops');
        Schema::dropIfExists('categories');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'phone', 'telegram_user_id', 'telegram_username', 'is_active']);
        });
    }
};
