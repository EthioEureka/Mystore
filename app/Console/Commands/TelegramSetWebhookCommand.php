<?php

namespace App\Console\Commands;

use App\Services\TelegramService;
use Illuminate\Console\Command;

class TelegramSetWebhookCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'telegram:webhook {action=info : Action: set, delete, info, or test} {--url= : Custom webhook URL}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Manage Telegram Bot Webhook (set, delete, get info, or test getMe)';

    /**
     * Execute the console command.
     */
    public function handle(TelegramService $telegram): int
    {
        $action = $this->argument('action');

        if (!$telegram->isConfigured()) {
            $this->error('TELEGRAM_BOT_TOKEN is not configured in your .env file.');
            $this->line('Add TELEGRAM_BOT_TOKEN and TELEGRAM_BOT_USERNAME to your .env to enable Telegram integration.');
            return 1;
        }

        switch ($action) {
            case 'test':
                $this->info('Testing Telegram Bot credentials...');
                $res = $telegram->getMe();
                if (!empty($res['ok'])) {
                    $user = $res['result'];
                    $this->info("✅ Bot connected: @{$user['username']} ({$user['first_name']}) [ID: {$user['id']}]");
                    return 0;
                }
                $this->error('❌ Connection failed: ' . json_encode($res));
                return 1;

            case 'set':
                $baseUrl = $this->option('url') ?: config('app.url');
                $webhookUrl = rtrim($baseUrl, '/') . '/telegram/webhook';
                $secretToken = config('services.telegram.webhook_secret');

                $this->info("Setting webhook to: {$webhookUrl}");
                $res = $telegram->setWebhook($webhookUrl, $secretToken);

                if (!empty($res['ok'])) {
                    $this->info('✅ Webhook successfully configured with Telegram!');
                    return 0;
                }
                $this->error('❌ Failed to set webhook: ' . json_encode($res));
                return 1;

            case 'delete':
                $this->info('Deleting webhook...');
                $res = $telegram->deleteWebhook();
                if (!empty($res['ok'])) {
                    $this->info('✅ Webhook removed.');
                    return 0;
                }
                $this->error('❌ Failed to delete webhook: ' . json_encode($res));
                return 1;

            case 'info':
            default:
                $this->info('Checking webhook status...');
                $res = $telegram->getWebhookInfo();
                if (!empty($res['ok'])) {
                    $info = $res['result'];
                    $this->table(
                        ['Key', 'Value'],
                        [
                            ['URL', $info['url'] ?: '(not set)'],
                            ['Has Custom Certificate', $info['has_custom_certificate'] ? 'Yes' : 'No'],
                            ['Pending Update Count', $info['pending_update_count'] ?? 0],
                            ['Last Error Date', isset($info['last_error_date']) ? date('Y-m-d H:i:s', $info['last_error_date']) : 'None'],
                            ['Last Error Message', $info['last_error_message'] ?? 'None'],
                        ]
                    );
                    return 0;
                }
                $this->error('❌ Failed to get webhook info: ' . json_encode($res));
                return 1;
        }
    }
}
