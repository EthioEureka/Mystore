<?php

namespace App\Services;

use App\Models\AppNotification;
use App\Models\Inquiry;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    protected TelegramService $telegramService;

    public function __construct(TelegramService $telegramService)
    {
        $this->telegramService = $telegramService;
    }

    /**
     * Dispatch notification for newly submitted inquiry
     */
    public function notifyNewInquiry(Inquiry $inquiry): void
    {
        $shop = $inquiry->shop;
        $owner = $shop->owner;

        if (!$owner) {
            return;
        }

        $title = "New Purchase Inquiry: #{$inquiry->reference_number}";
        $message = "Customer {$inquiry->customer_name} submitted an inquiry for {$inquiry->quantity}x {$inquiry->product_name_snapshot}.";

        // 1. Dashboard internal notification
        $notification = AppNotification::create([
            'user_id' => $owner->id,
            'shop_id' => $shop->id,
            'inquiry_id' => $inquiry->id,
            'type' => 'new_inquiry',
            'title' => $title,
            'message' => $message,
            'action_url' => "/manager/inquiries/{$inquiry->id}",
            'is_read' => false,
            'telegram_delivery_status' => 'pending',
        ]);

        // 2. Telegram Bot notification if shop owner has linked telegram and notifications enabled
        if ($shop->notifications_enabled && $owner->telegram_user_id) {
            $formattedPrice = $inquiry->unit_price_snapshot 
                ? "{$inquiry->unit_price_snapshot} {$inquiry->currency_snapshot}"
                : "Price on request";

            $telegramText = "<b>🔔 New Customer Inquiry!</b>\n\n"
                . "<b>Ref:</b> <code>{$inquiry->reference_number}</code>\n"
                . "<b>Shop:</b> " . htmlspecialchars($shop->name) . "\n"
                . "<b>Product:</b> " . htmlspecialchars($inquiry->product_name_snapshot) . "\n"
                . ($inquiry->variant_description_snapshot ? "<b>Variant:</b> " . htmlspecialchars($inquiry->variant_description_snapshot) . "\n" : "")
                . "<b>Quantity:</b> {$inquiry->quantity}\n"
                . "<b>Price:</b> {$formattedPrice}\n"
                . "<b>Customer:</b> " . htmlspecialchars($inquiry->customer_name) . "\n"
                . "<b>Phone:</b> " . htmlspecialchars($inquiry->customer_phone) . "\n"
                . ($inquiry->customer_telegram_username ? "<b>Telegram:</b> @" . htmlspecialchars(ltrim($inquiry->customer_telegram_username, '@')) . "\n" : "")
                . ($inquiry->customer_note ? "<b>Note:</b> " . htmlspecialchars($inquiry->customer_note) . "\n" : "")
                . "\n<i>⚠️ Payment and delivery arrangements are to be agreed directly with customer.</i>";

            $buttons = [];
            if ($inquiry->customer_telegram_username) {
                $cleanUser = ltrim($inquiry->customer_telegram_username, '@');
                $buttons[] = [
                    ['text' => '💬 Contact on Telegram', 'url' => "https://t.me/{$cleanUser}"]
                ];
            }
            if ($inquiry->customer_phone) {
                $buttons[] = [
                    ['text' => '📞 Call Customer', 'url' => "tel:{$inquiry->customer_phone}"]
                ];
            }

            $replyMarkup = !empty($buttons) ? ['inline_keyboard' => $buttons] : [];

            $result = $this->telegramService->sendMessage($owner->telegram_user_id, $telegramText, $replyMarkup);

            if (!empty($result['ok'])) {
                $notification->update([
                    'telegram_delivery_status' => 'sent',
                    'telegram_delivered_at' => now(),
                ]);
            } else {
                $notification->update([
                    'telegram_delivery_status' => 'failed',
                    'telegram_delivery_error' => $result['error'] ?? 'Unknown telegram error',
                ]);
            }
        } else {
            $notification->update([
                'telegram_delivery_status' => 'skipped',
            ]);
        }
    }
}
