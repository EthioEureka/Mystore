<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Shop extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'description',
        'logo',
        'cover_image',
        'category_id',
        'public_phone',
        'public_telegram_username',
        'public_address',
        'business_hours',
        'contact_method_preference',
        'delivery_note',
        'general_instructions',
        'status',
        'rejection_reason',
        'suspension_reason',
        'notifications_enabled',
    ];

    protected $casts = [
        'notifications_enabled' => 'boolean',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function users()
    {
        return $this->hasMany(User::class, 'shop_id');
    }

    public function staff()
    {
        return $this->hasMany(User::class, 'shop_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function inquiries()
    {
        return $this->hasMany(Inquiry::class);
    }

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    public function isSuspended(): bool
    {
        return $this->status === 'suspended';
    }
}
