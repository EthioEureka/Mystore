import React from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Link } from '@inertiajs/react';
import { Check, MessageCircle, Phone, ArrowRight } from 'lucide-react';

export default function InquiryConfirmation({ inquiry, shop }) {
  return (
    <CustomerLayout title="Inquiry Sent">
      <div className="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs text-center mb-5">
        {/* Success Badge */}
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
          <Check className="w-8 h-8 stroke-[2.5]" />
        </div>

        <h2 className="text-lg font-bold text-[#182033]">Inquiry Sent Successfully!</h2>
        <p className="text-xs text-[#667085] mt-1 max-w-xs mx-auto">
          Your purchase request has been submitted to <strong>{shop.name}</strong>.
        </p>

        {/* Reference Badge */}
        <div className="my-4 p-3 bg-gray-50 rounded-2xl border border-gray-100 inline-block">
          <span className="text-[11px] text-[#667085] uppercase tracking-wider block">Reference Number</span>
          <span className="text-sm font-mono font-bold text-[#182033]">{inquiry.reference_number}</span>
        </div>

        {/* Snapshot details */}
        <div className="text-left bg-gray-50/70 rounded-2xl p-4 border border-gray-100 text-xs space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-[#667085]">Product:</span>
            <span className="font-bold text-[#182033]">{inquiry.product_name_snapshot}</span>
          </div>
          {inquiry.variant_description_snapshot && (
            <div className="flex justify-between">
              <span className="text-[#667085]">Variant:</span>
              <span className="font-medium text-[#182033]">{inquiry.variant_description_snapshot}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-[#667085]">Quantity:</span>
            <span className="font-medium text-[#182033]">{inquiry.quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#667085]">Snapshot Price:</span>
            <span className="font-bold text-[#182033]">
              {inquiry.unit_price_snapshot ? `$${inquiry.unit_price_snapshot}` : 'Price on request'}
            </span>
          </div>
        </div>

        {/* Clear Non-Payment Reminder */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-[11px] text-amber-900 text-left leading-relaxed mb-5">
          <strong>Next Steps:</strong> The shop owner will contact you directly to confirm availability, final price, delivery location, and payment. <strong>No payment has been collected by this platform.</strong>
        </div>

        {/* Direct Contact CTA buttons */}
        <div className="space-y-2.5">
          {shop.public_telegram_username && (
            <a
              href={`https://t.me/${shop.public_telegram_username}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-[#3F51D7] hover:bg-[#3142BD] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message Shop on Telegram (@{shop.public_telegram_username})</span>
            </a>
          )}

          {shop.public_phone && (
            <a
              href={`tel:${shop.public_phone}`}
              className="w-full py-3 bg-white border border-[#E6E8EF] hover:bg-gray-50 text-[#182033] font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Call Shop ({shop.public_phone})</span>
            </a>
          )}

          <Link
            href="/inquiries/history"
            className="w-full py-2.5 text-xs font-semibold text-[#667085] hover:text-[#182033] flex items-center justify-center gap-1"
          >
            <span>View My Inquiries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </CustomerLayout>
  );
}

