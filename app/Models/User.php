<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'shop_id',
        'name',
        'email',
        'password',
        'role',
        'phone',
        'telegram_user_id',
        'telegram_username',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'telegram_user_id' => 'integer',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isShopOwner(): bool
    {
        return $this->role === 'shop_owner';
    }

    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }

    public function isStaff(): bool
    {
        return $this->role === 'shop_staff' || $this->role === 'shop_owner';
    }

    public function shops()
    {
        return $this->hasMany(Shop::class);
    }

    public function shop()
    {
        // If assigned directly to a shop (tenant / staff), or owns the shop
        if ($this->shop_id) {
            return $this->belongsTo(Shop::class, 'shop_id');
        }
        return $this->hasOne(Shop::class, 'user_id');
    }

    public function inquiries()
    {
        return $this->hasMany(Inquiry::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function notifications()
    {
        return $this->hasMany(AppNotification::class);
    }
}
