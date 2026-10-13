<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Shop;
use App\Models\User;
use App\Services\TelegramService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TelegramIntegrationController extends Controller
{
    protected TelegramService $telegramService;

    public function __construct(TelegramService $telegramService)
    {
        $this->telegramService = $telegramService;
    }

    /**
     * Authenticate or link user via Telegram Mini App initData
     */
    public function authenticate(Request $request): JsonResponse
    {
        $initData = $request->input('initData');

        if (empty($initData)) {
            return response()->json(['error' => 'Missing initData'], 400);
        }

        $tgUser = $this->telegramService->validateInitData($initData);

        if (!$tgUser || empty($tgUser['id'])) {
            return response()->json(['error' => 'Invalid or expired Telegram signature'], 401);
        }

        $telegramId = (int) $tgUser['id'];
        $telegramUsername = $tgUser['username'] ?? null;
        $firstName = $tgUser['first_name'] ?? 'Telegram';
        $lastName = $tgUser['last_name'] ?? 'User';
        $fullName = trim("{$firstName} {$lastName}");

        // Find or create customer user
        $user = User::where('telegram_user_id', $telegramId)->first();

        if (!$user) {
            $user = User::create([
                'name' => $fullName,
                'email' => "tg_{$telegramId}@telegram.local",
                'password' => bcrypt(str()->random(24)),
                'role' => 'customer',
                'telegram_user_id' => $telegramId,
                'telegram_username' => $telegramUsername,
                'is_active' => true,
            ]);
        } else {
            // Update latest username if changed
            if ($telegramUsername && $user->telegram_username !== $telegramUsername) {
                $user->update(['telegram_username' => $telegramUsername]);
            }
        }

        Auth::login($user);

        return response()->json([
            'ok' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'telegram_username' => $user->telegram_username,
                'telegram_user_id' => $user->telegram_user_id,
            ],
        ]);
    }

    /**
     * Webhook handling Telegram Bot updates (/start command & deep links)
     */
    public function webhook(Request $request): JsonResponse
    {
        $update = $request->all();
        Log::info('Telegram update received:', ['update' => $update]);

        if (isset($update['message']['text'])) {
            $chatId = $update['message']['chat']['id'];
            $text = trim($update['message']['text']);
            $sender = $update['message']['from'] ?? [];

            if (str_starts_with($text, '/start')) {
                $this->handleStartCommand($chatId, $text, $sender);
            }
        }

        return response()->json(['status' => 'ok']);
    }

    protected function handleStartCommand(int|string $chatId, string $text, array $sender): void
    {
        $parts = explode(' ', $text);
        $param = $parts[1] ?? 'marketplace';

        $appUrl = config('app.url');
        $botUsername = $this->telegramService->getBotUsername();

        $deepLinkUrl = "{$appUrl}";

        if (str_starts_with($param, 'shop_')) {
            $slug = substr($param, 5);
            $deepLinkUrl = "{$appUrl}/shops/{$slug}";
            $welcomeHeader = "Welcome! Tap below to view this shop:";
        } elseif (str_starts_with($param, 'product_')) {
            $prodRef = substr($param, 8);
            $deepLinkUrl = "{$appUrl}/search?q=" . urlencode($prodRef);
            $welcomeHeader = "Welcome! Tap below to open this product:";
        } else {
            $welcomeHeader = "Welcome to <b>Telegram Shop Marketplace</b> 👋\n\n"
                . "Discover products from local shops, check stock & variants, and submit purchase inquiries. "
                . "Contact shop owners directly via phone or Telegram to finalize payment and delivery.\n\n"
                . "<i>ℹ️ All payments and deliveries happen directly between you and the shop owner outside the platform.</i>";
        }

        $replyMarkup = [
            'inline_keyboard' => [
                [
                    [
                        'text' => '🛍️ Browse Marketplace',
                        'web_app' => ['url' => $deepLinkUrl]
                    ]
                ],
                [
                    [
                        'text' => '📂 Browse Categories',
                        'web_app' => ['url' => "{$appUrl}/categories"]
                    ],
                    [
                        'text' => '📋 My Inquiries',
                        'web_app' => ['url' => "{$appUrl}/inquiries/history"]
                    ]
                ]
            ]
        ];

        $this->telegramService->sendMessage($chatId, $welcomeHeader, $replyMarkup);
    }
}
