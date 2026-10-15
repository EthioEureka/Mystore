import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';
import { Sliders, ShieldCheck, CheckCircle2, AlertCircle, Bot, DollarSign, Store } from 'lucide-react';

export default function AdminSettings({ settings, telegram_configured, telegram_bot_username }) {
  const { data, setData, post, processing } = useForm({
    marketplace_name: settings?.marketplace_name || 'Telegram Shop Marketplace',
    default_currency: settings?.default_currency || 'ETB',
    allow_shop_registration: false, // Self-registration disabled permanently per SaaS specification
    require_shop_approval: Boolean(Number(settings?.require_shop_approval ?? 1)),
  });

  function handleSubmit(e) {
    e.preventDefault();
    post('/admin/settings');
  }

  return (
    <AdminLayout
      title="Platform & Multi-Tenant Settings"
      subtitle="Configure global marketplace operations, registration mode, and Telegram Bot integration"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 lg:p-8 border border-[#E6E8EF] shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-2xl bg-[#EEF0FD] text-[#3F51D7] flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#111827]">Core Marketplace Settings</h3>
              <p className="text-xs text-[#6B7280]">Global operational parameters</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1.5">Platform Brand Name</label>
              <input
                value={data.marketplace_name}
                onChange={(e) => setData('marketplace_name', e.target.value)}
                type="text"
                required
                className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#3F51D7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1.5">Default Display Currency</label>
              <input
                value={data.default_currency}
                onChange={(e) => setData('default_currency', e.target.value)}
                type="text"
                required
                className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3.5 py-2.5 outline-none font-mono focus:border-[#3F51D7]"
              />
            </div>

            {/* Registration Policy Card */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#111827]">Shop Self-Registration</div>
                  <div className="text-[11px] text-[#6B7280]">
                    Only administrators can provision new shops from the admin dashboard.
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[10px] font-black border border-rose-200">
                  Disabled (Admin Only)
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={processing}
                className="px-6 py-2.5 bg-[#3F51D7] hover:bg-[#3142BD] text-white text-xs font-bold rounded-xl shadow-xs transition disabled:opacity-50"
              >
                {processing ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>

        {/* Telegram Integration Status Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#111827]">Telegram Bot Gateway</h4>
                <p className="text-[11px] text-[#6B7280]">Mini App & automated notifications</p>
              </div>
            </div>

            <div
              className={`p-4 rounded-2xl border mb-4 ${
                telegram_configured ? 'bg-emerald-50/70 border-emerald-200' : 'bg-amber-50/70 border-amber-200'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {telegram_configured ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-xs font-bold text-[#111827]">
                    {telegram_configured ? 'Telegram Bot Connected' : 'Bot Token Not Set'}
                  </div>
                  <p className="text-[11px] text-[#6B7280] mt-0.5 leading-relaxed">
                    {telegram_configured
                      ? `Operating live with @${telegram_bot_username}`
                      : 'Add TELEGRAM_BOT_TOKEN and TELEGRAM_BOT_USERNAME in .env to link your live bot.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs space-y-2">
              <div className="font-bold text-[#111827]">Useful Artisan Commands:</div>
              <div className="p-2 rounded-xl bg-white border border-gray-200 font-mono text-[11px] text-[#3F51D7]">
                php artisan telegram:webhook test
              </div>
              <div className="p-2 rounded-xl bg-white border border-gray-200 font-mono text-[11px] text-[#3F51D7]">
                php artisan telegram:webhook set
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
