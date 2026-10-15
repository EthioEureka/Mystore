<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    protected ?string $botToken;
    protected ?string $botUsername;

    public function __construct()
    {
        $this->botToken = config('services.telegram.bot_token', env('TELEGRAM_BOT_TOKEN'));
        $this->botUsername = config('services.telegram.bot_username', env('TELEGRAM_BOT_USERNAME', 'telegram_shop_bot'));
    }

    public function isConfigured(): bool
    {
        return !empty($this->botToken);
    }

    public function getBotUsername(): string
    {
        return $this->botUsername ?? 'telegram_shop_bot';
    }

    /**
     * Validate Telegram Mini App initData according to official Telegram documentation
     */
    public function validateInitData(string $initData): ?array
    {
        if (empty($this->botToken)) {
            // In development without token, if test payload provided, decode safe fields
            parse_str($initData, $parsed);
            if (!empty($parsed['user'])) {
                return json_decode($parsed['user'], true);
            }
            return null;
        }

        parse_str($initData, $data);
        if (!isset($data['hash'])) {
            return null;
        }

        $hash = $data['hash'];
        unset($data['hash']);

        // Check auth_date freshness (e.g. within 24 hours)
        if (isset($data['auth_date']) && (time() - (int)$data['auth_date'] > 86400)) {
            Log::warning('Telegram initData expired');
            return null;
        }

        // Sort keys alphabetically
        ksort($data);
        $dataCheckArr = [];
        foreach ($data as $key => $val) {
            $dataCheckArr[] = "{$key}={$val}";
        }
        $dataCheckString = implode("\n", $dataCheckArr);

        // HMAC-SHA256 with key "WebAppData"
        $secretKey = hash_hmac('sha256', $this->botToken, 'WebAppData', true);
        $calculatedHash = hash_hmac('sha256', $dataCheckString, $secretKey);

        if (!hash_equals($calculatedHash, $hash)) {
            Log::warning('Telegram initData signature verification failed');
            return null;
        }

        return isset($data['user']) ? json_decode($data['user'], true) : [];
    }

    /**
     * Send Telegram message to user
     */
    public function sendMessage(int|string $chatId, string $text, array $replyMarkup = []): array
    {
        if (empty($this->botToken)) {
            Log::info("Telegram mock message to {$chatId}: {$text}");
            return ['ok' => true, 'mock' => true];
        }

        $url = "https://api.telegram.org/bot{$this->botToken}/sendMessage";
        $payload = [
            'chat_id' => $chatId,
            'text' => $text,
            'parse_mode' => 'HTML',
        ];

        if (!empty($replyMarkup)) {
            $payload['reply_markup'] = json_encode($replyMarkup);
        }

        try {
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($payload));
            curl_setopt($ch, CURLOPT_TIMEOUT, 5);
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode >= 200 && $httpCode < 300) {
                return json_decode($response, true) ?: ['ok' => true];
            }

            Log::error("Telegram API error: {$response}");
            return ['ok' => false, 'error' => $response];
        } catch (\Throwable $e) {
            Log::error("Telegram send exception: {$e->getMessage()}");
            return ['ok' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Set the Telegram Bot Webhook
     */
    public function setWebhook(string $url, ?string $secretToken = null): array
    {
        if (empty($this->botToken)) {
            return ['ok' => false, 'error' => 'TELEGRAM_BOT_TOKEN is not configured'];
        }

        $params = [
            'url' => $url,
            'allowed_updates' => json_encode(['message', 'callback_query']),
        ];

        if ($secretToken) {
            $params['secret_token'] = $secretToken;
        }

        return $this->executeApiCall('setWebhook', $params);
    }

    /**
     * Delete the Telegram Bot Webhook
     */
    public function deleteWebhook(): array
    {
        if (empty($this->botToken)) {
            return ['ok' => false, 'error' => 'TELEGRAM_BOT_TOKEN is not configured'];
        }

        return $this->executeApiCall('deleteWebhook');
    }

    /**
     * Test bot token and get bot details
     */
    public function getMe(): array
    {
        if (empty($this->botToken)) {
            return ['ok' => false, 'error' => 'TELEGRAM_BOT_TOKEN is not configured'];
        }

        return $this->executeApiCall('getMe');
    }

    /**
     * Get current Webhook info
     */
    public function getWebhookInfo(): array
    {
        if (empty($this->botToken)) {
            return ['ok' => false, 'error' => 'TELEGRAM_BOT_TOKEN is not configured'];
        }

        return $this->executeApiCall('getWebhookInfo');
    }

    protected function executeApiCall(string $method, array $params = []): array
    {
        $url = "https://api.telegram.org/bot{$this->botToken}/{$method}";

        try {
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            if (!empty($params)) {
                curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
            }
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            $decoded = json_decode($response, true);
            return $decoded ?: ['ok' => false, 'error' => $response, 'http_code' => $httpCode];
        } catch (\Throwable $e) {
            Log::error("Telegram {$method} exception: {$e->getMessage()}");
            return ['ok' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Format a clean telegram user link or mention
     */
    public function formatUserContactUrl(?string $username, ?int $telegramId = null): ?string
    {
        if ($username) {
            $clean = ltrim($username, '@');
            return "https://t.me/{$clean}";
        }
        if ($telegramId) {
            return "tg://user?id={$telegramId}";
        }
        return null;
    }
}
