import React from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export default function InquiryCheckout({ shop, product, selectedVariant, initialQuantity, prefill }) {
  const unitPrice = selectedVariant?.price
    ? Number(selectedVariant.price)
    : Number(product.sale_price || product.price || 0);

  const { data, setData, post, processing, errors } = useForm({
    customer_name: prefill?.name || '',
    customer_phone: prefill?.phone || '',
    customer_telegram_username: prefill?.telegram_username || '',
    product_variant_id: selectedVariant?.id || null,
    quantity: initialQuantity || 1,
    preferred_contact_method: 'either',
    customer_note: '',
    acknowledges_offline_sale: true,
  });

  React.useEffect(() => {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      const u = window.Telegram.WebApp.initDataUnsafe.user;
      if (!data.customer_name && (u.first_name || u.last_name)) {
        setData('customer_name', `${u.first_name || ''} ${u.last_name || ''}`.trim());
      }
      if (!data.customer_telegram_username && u.username) {
        setData('customer_telegram_username', u.username);
      }
    }
  }, []);

  const estimatedTotal = (unitPrice * data.quantity).toFixed(2);

  function handleSubmit(e) {
    e.preventDefault();
    post(`/shops/${shop.slug}/products/${product.slug}/inquire`);
  }

  return (
    <CustomerLayout title="Purchase Inquiry">
      {/* Back button */}
      <div className="mb-4">
        <Link
          href={`/shops/${shop.slug}/products/${product.slug}`}
          className="text-xs text-[#667085] hover:text-[#182033] flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to product</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-5 border border-[#E6E8EF] shadow-xs mb-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-[#EEF0FD] text-[#3F51D7] flex items-center justify-center text-xs font-bold">
            1
          </div>
          <h3 className="text-sm font-bold text-[#182033]">Inquiry Summary</h3>
        </div>

        {/* Item snapshot review */}
        <div className="flex gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100 mb-4">
          <img
            src={product.primary_image?.image_path || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&auto=format&fit=crop'}
            alt={product.name}
            className="w-16 h-16 object-cover rounded-xl bg-white border border-gray-100 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-[#182033] truncate">{product.name}</h4>
            <p className="text-[11px] text-[#667085] truncate">Shop: {shop.name}</p>
            {selectedVariant && (
              <p className="text-[11px] text-[#3F51D7] font-medium">
                Variant: {selectedVariant.name}
              </p>
            )}
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xs font-bold text-[#182033]">
                Qty: {data.quantity} &times; ${unitPrice}
              </span>
              <span className="text-xs font-extrabold text-[#182033]">
                ${estimatedTotal}
              </span>
            </div>
          </div>
        </div>

        {/* Clear Non-Payment Notice */}
        <div className="bg-blue-50/70 border border-blue-200/60 rounded-xl p-3 text-[11px] text-blue-900 leading-relaxed mb-4">
          <strong>ℹ️ No online payment required:</strong> This form creates a purchase request. The shop owner will contact you to verify stock, final total, delivery time, and payment method (cash on delivery, bank transfer, or in-person).
        </div>

        {/* Contact details form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#182033] mb-1">
              Your Full Name <span className="text-red-500">*</span>
            </label>
            <input
              value={data.customer_name}
              onChange={(e) => setData('customer_name', e.target.value)}
              type="text"
              required
              placeholder="e.g. Dawit Tadesse"
              className="w-full text-xs bg-gray-50/50 border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:bg-white focus:border-[#3F51D7] focus:ring-1 focus:ring-[#3F51D7] outline-none"
            />
            {errors.customer_name && (
              <div className="text-[10px] text-red-500 mt-1">{errors.customer_name}</div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#182033] mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              value={data.customer_phone}
              onChange={(e) => setData('customer_phone', e.target.value)}
              type="tel"
              required
              placeholder="e.g. +251 91 123 4567"
              className="w-full text-xs bg-gray-50/50 border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:bg-white focus:border-[#3F51D7] focus:ring-1 focus:ring-[#3F51D7] outline-none"
            />
            {errors.customer_phone && (
              <div className="text-[10px] text-red-500 mt-1">{errors.customer_phone}</div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#182033] mb-1">
              Telegram Username (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-[#667085] text-xs font-medium">@</span>
              <input
                value={data.customer_telegram_username}
                onChange={(e) => setData('customer_telegram_username', e.target.value)}
                type="text"
                placeholder="username"
                className="w-full text-xs bg-gray-50/50 border border-[#E6E8EF] rounded-xl pl-7 pr-3 py-2.5 focus:bg-white focus:border-[#3F51D7] focus:ring-1 focus:ring-[#3F51D7] outline-none"
              />
            </div>
            <p className="text-[10px] text-[#667085] mt-1">
              Helps the shop owner reach you quickly inside Telegram.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#182033] mb-1">
              Preferred Contact Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['telegram', 'phone', 'either'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setData('preferred_contact_method', method)}
                  className={`py-2 text-xs font-medium rounded-xl border text-center capitalize transition ${
                    data.preferred_contact_method === method
                      ? 'border-[#3F51D7] bg-[#EEF0FD] text-[#3F51D7] font-semibold'
                      : 'border-[#E6E8EF] text-[#182033] hover:bg-gray-50'
                  }`}
                >
                  {method === 'telegram' ? 'Telegram' : method === 'phone' ? 'Phone' : 'Either'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#182033] mb-1">
              Note for Shop (Optional)
            </label>
            <textarea
              value={data.customer_note}
              onChange={(e) => setData('customer_note', e.target.value)}
              rows="2"
              placeholder="Preferred delivery address, size questions, or timing..."
              className="w-full text-xs bg-gray-50/50 border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:bg-white focus:border-[#3F51D7] focus:ring-1 focus:ring-[#3F51D7] outline-none resize-none"
            />
          </div>

          {/* Mandatory offline agreement */}
          <label className="flex items-start gap-2.5 p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer">
            <input
              checked={data.acknowledges_offline_sale}
              onChange={(e) => setData('acknowledges_offline_sale', e.target.checked)}
              type="checkbox"
              required
              className="mt-0.5 rounded text-[#3F51D7] focus:ring-[#3F51D7]"
            />
            <span className="text-[11px] text-[#182033] leading-relaxed">
              I understand that <strong>no payment is processed on this platform</strong>. I will arrange payment and delivery directly with {shop.name}.
            </span>
          </label>
          {errors.acknowledges_offline_sale && (
            <div className="text-[10px] text-red-500">{errors.acknowledges_offline_sale}</div>
          )}

          <button
            type="submit"
            disabled={processing || !data.acknowledges_offline_sale}
            className="w-full py-3.5 bg-[#3F51D7] hover:bg-[#3142BD] disabled:bg-gray-300 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
          >
            {processing ? (
              <span>Submitting Inquiry...</span>
            ) : (
              <>
                <span>Send Purchase Inquiry</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </CustomerLayout>
  );
}

