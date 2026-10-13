<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference_number',
        'shop_id',
        'user_id',
        'product_id',
        'product_variant_id',
        'customer_name',
        'customer_phone',
        'customer_telegram_username',
        'customer_telegram_id',
        'preferred_contact_method',
        'customer_note',
        'product_name_snapshot',
        'variant_description_snapshot',
        'product_image_snapshot',
        'quantity',
        'unit_price_snapshot',
        'subtotal_snapshot',
        'currency_snapshot',
        'status',
        'viewed_at',
        'responded_at',
        'closed_at',
        'cancelled_at',
        'manager_notes',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price_snapshot' => 'decimal:2',
        'subtotal_snapshot' => 'decimal:2',
        'customer_telegram_id' => 'integer',
        'viewed_at' => 'datetime',
        'responded_at' => 'datetime',
        'closed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    public function histories()
    {
        return $this->hasMany(InquiryStatusHistory::class)->latest();
    }

    public static function generateReference(): string
    {
        $year = date('Y');
        $random = strtoupper(bin2hex(random_bytes(3))); // 6 hex chars
        return "INQ-{$year}-{$random}";
    }
}
