<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'shop_id',
        'category_id',
        'name',
        'slug',
        'description',
        'sku',
        'price',
        'sale_price',
        'currency',
        'status',
        'stock',
        'has_variants',
        'is_featured',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'stock' => 'integer',
        'has_variants' => 'boolean',
        'is_featured' => 'boolean',
    ];

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('display_order');
    }

    public function primaryImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function inquiries()
    {
        return $this->hasMany(Inquiry::class);
    }

    public function isPublished(): bool
    {
        return $this->status === 'published';
    }

    public function getEffectivePriceAttribute()
    {
        return $this->sale_price ?? $this->price;
    }

    public function getTotalStockAttribute()
    {
        if ($this->has_variants) {
            return $this->variants()->sum('stock');
        }
        return $this->stock;
    }

    public function getAvailabilityStatusAttribute(): string
    {
        $total = $this->total_stock;
        if ($total <= 0) {
            return 'out_of_stock';
        }
        if ($total <= 5) {
            return 'low_stock';
        }
        return 'in_stock';
    }
}
