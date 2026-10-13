import React from 'react';
import ManagerLayout from '@/Layouts/ManagerLayout';
import { useForm } from '@inertiajs/react';

export default function ShopSettings({ shop, categories }) {
  const { data, setData, put, processing } = useForm({
    name: shop.name,
    description: shop.description || '',
    logo: shop.logo || '',
    cover_image: shop.cover_image || '',
    category_id: shop.category_id,
    public_phone: shop.public_phone || '',
    public_telegram_username: shop.public_telegram_username || '',
    public_address: shop.public_address || '',
    business_hours: shop.business_hours || '',
    contact_method_preference: shop.contact_method_preference || 'both',
    delivery_note: shop.delivery_note || '',
    general_instructions: shop.general_instructions || '',
    notifications_enabled: Boolean(shop.notifications_enabled),
  });

  function handleSubmit(e) {
    e.preventDefault();
    put('/manager/settings');
  }

  return (
    <ManagerLayout title="Shop Settings & Public Contact" shop={shop}>
      <div className="max-w-2xl bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
        <h3 className="text-sm font-bold text-[#182033] mb-4">Shop Profile & Contact Information</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#182033] mb-1">Shop Name</label>
            <input
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              type="text"
              required
              className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#182033] mb-1">About / Bio</label>
            <textarea
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              rows="3"
              className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#182033] mb-1">Public Telegram Username</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[#667085] text-xs">@</span>
                <input
                  value={data.public_telegram_username}
                  onChange={(e) => setData('public_telegram_username', e.target.value)}
                  type="text"
                  placeholder="shop_bot"
                  className="w-full text-xs border border-[#E6E8EF] rounded-xl pl-7 pr-3 py-2.5 focus:border-[#3F51D7] outline-none"
                />
              </div>
              <p className="text-[10px] text-[#667085] mt-1">Customers will tap this to contact you directly on Telegram.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#182033] mb-1">Public Phone Number</label>
              <input
                value={data.public_phone}
                onChange={(e) => setData('public_phone', e.target.value)}
                type="tel"
                placeholder="+251 91 123 4567"
                className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#182033] mb-1">Store Address / Area</label>
            <input
              value={data.public_address}
              onChange={(e) => setData('public_address', e.target.value)}
              type="text"
              placeholder="e.g. Bole Medhanialem, Edna Mall 2nd Floor"
              className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#182033] mb-1">Delivery Policy & Note</label>
            <textarea
              value={data.delivery_note}
              onChange={(e) => setData('delivery_note', e.target.value)}
              rows="2"
              placeholder="e.g. Same-day motorbike delivery inside Addis Ababa, or in-store pickup."
              className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none resize-none"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.notifications_enabled}
                onChange={(e) => setData('notifications_enabled', e.target.checked)}
                className="rounded text-[#3F51D7]"
              />
              <span className="text-xs font-medium text-[#182033]">
                Enable Telegram Bot notifications when new inquiries arrive
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
    </ManagerLayout>
  );
}

