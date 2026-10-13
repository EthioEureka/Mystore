import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';

export default function AdminSettings({ settings, telegram_configured, telegram_bot_username }) {
  const { data, setData, post, processing } = useForm({
    marketplace_name: settings?.marketplace_name || 'Telegram Shop Marketplace',
    default_currency: settings?.default_currency || 'ETB',
    allow_shop_registration: Boolean(Number(settings?.allow_shop_registration ?? 1)),
    require_shop_approval: Boolean(Number(settings?.require_shop_approval ?? 1)),
  });

  function handleSubmit(e) {
    e.preventDefault();
    post('/admin/settings');
  }

  return (
    <AdminLayout title="Platform & Telegram Settings">
      <div className="max-w-xl bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
        <h3 className="text-sm font-bold text-[#182033] mb-4">Marketplace Configuration</h3>

        {/* Telegram Bot Integration Status */}
        <div
          className={`p-4 rounded-2xl border mb-6 ${
            telegram_configured ? 'bg-emerald-50/60 border-emerald-200' : 'bg-amber-50/60 border-amber-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-base">{telegram_configured ? '✅' : '⚠️'}</span>
            <div className="text-xs">
              <span className="font-bold text-[#182033]">Telegram Bot Integration</span>
              <p className="text-[#667085] mt-0.5">
                {telegram_configured
                  ? `Connected with bot @${telegram_bot_username}`
                  : 'TELEGRAM_BOT_TOKEN is not set in .env yet. Bot notifications will run in safe mock mode.'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#182033] mb-1">Marketplace Name</label>
            <input
              value={data.marketplace_name}
              onChange={(e) => setData('marketplace_name', e.target.value)}
              type="text"
              required
              className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#182033] mb-1">Default Display Currency</label>
            <input
              value={data.default_currency}
              onChange={(e) => setData('default_currency', e.target.value)}
              type="text"
              required
              className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 outline-none font-mono"
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.allow_shop_registration}
                onChange={(e) => setData('allow_shop_registration', e.target.checked)}
                className="rounded text-[#3F51D7]"
              />
              <span className="text-xs font-medium text-[#182033]">Allow public merchant registration</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.require_shop_approval}
                onChange={(e) => setData('require_shop_approval', e.target.checked)}
                className="rounded text-[#3F51D7]"
              />
              <span className="text-xs font-medium text-[#182033]">
                Require admin approval before shops can accept inquiries
              </span>
            </label>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={processing}
              className="px-5 py-2.5 bg-[#3F51D7] text-white text-xs font-semibold rounded-xl hover:bg-[#3142BD] disabled:opacity-50"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

