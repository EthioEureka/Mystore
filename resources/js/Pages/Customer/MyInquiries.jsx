import React from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Link, router } from '@inertiajs/react';
import { MessageCircle, Phone } from 'lucide-react';

export default function MyInquiries({ inquiries }) {
  function cancelInquiry(ref) {
    if (confirm('Are you sure you want to cancel this purchase inquiry?')) {
      router.post(`/inquiries/${ref}/cancel`);
    }
  }

  return (
    <CustomerLayout title="My Inquiries">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#182033]">Inquiry History</h3>
        <span className="text-xs text-[#667085]">{inquiries.data?.length || 0} inquiries</span>
      </div>

      {/* Empty state */}
      {!inquiries.data || inquiries.data.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-[#E6E8EF] text-center shadow-xs">
          <div className="text-3xl mb-2">📋</div>
          <h4 className="text-sm font-bold text-[#182033]">No Inquiries Found</h4>
          <p className="text-xs text-[#667085] mt-1 max-w-xs mx-auto">
            When you submit a contact or purchase inquiry, its status and merchant details will appear here.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 px-4 py-2 bg-[#3F51D7] text-white text-xs font-semibold rounded-xl hover:bg-[#3142BD]"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.data.map((inquiry) => (
            <div
              key={inquiry.id}
              className="bg-white rounded-2xl p-4 border border-[#E6E8EF] shadow-xs"
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-gray-100 mb-2.5">
                <span className="text-xs font-mono font-bold text-[#182033]">#{inquiry.reference_number}</span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                    inquiry.status === 'sent'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : inquiry.status === 'viewed'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : inquiry.status === 'responded'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : inquiry.status === 'closed'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {inquiry.status}
                </span>
              </div>

              <div className="flex gap-3 items-center mb-3">
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                  {inquiry.product_image_snapshot ? (
                    <img
                      src={inquiry.product_image_snapshot}
                      alt={inquiry.product_name_snapshot}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs">📦</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#182033] truncate">{inquiry.product_name_snapshot}</h4>
                  <p className="text-[11px] text-[#667085] truncate">Shop: {inquiry.shop?.name}</p>
                  <div className="text-[11px] font-medium text-[#182033] mt-0.5">
                    Qty: {inquiry.quantity} &middot; {inquiry.unit_price_snapshot ? `$${inquiry.unit_price_snapshot}` : 'On request'}
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {inquiry.shop?.public_telegram_username && (
                    <a
                      href={`https://t.me/${inquiry.shop.public_telegram_username}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#3F51D7] font-semibold hover:underline flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Telegram</span>
                    </a>
                  )}
                  {inquiry.shop?.public_phone && (
                    <a
                      href={`tel:${inquiry.shop.public_phone}`}
                      className="text-[#667085] font-semibold hover:underline flex items-center gap-1 ml-2"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                  )}
                </div>

                {['sent', 'viewed'].includes(inquiry.status) && (
                  <button
                    onClick={() => cancelInquiry(inquiry.reference_number)}
                    className="text-red-500 hover:underline text-[11px] font-medium"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </CustomerLayout>
  );
}

