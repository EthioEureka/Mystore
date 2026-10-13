<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppNotification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'shop_id',
        'inquiry_id',
        'type',
        'title',
        'message',
        'action_url',
        'is_read',
        'telegram_delivery_status',
        'telegram_delivery_error',
        'telegram_delivered_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'telegram_delivered_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function inquiry()
    {
        return $this->belongsTo(Inquiry::class);
    }
}
