import React from 'react';
import ManagerLayout from '@/Layouts/ManagerLayout';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, MessageCircle, Phone } from 'lucide-react';

export default function ShowInquiry({ shop, inquiry }) {
  const { data, setData, put, processing } = useForm({
    status: inquiry.status === 'sent' ? 'viewed' : inquiry.status,
    comment: '',
    manager_notes: inquiry.manager_notes || '',
  });

  function updateStatus(e) {
    e.preventDefault();
    put(`/manager/inquiries/${inquiry.id}/status`);
  }

  return (
    <ManagerLayout title="Inquiry Details" shop={shop}>
      <div className="mb-4">
        <Link href="/manager/inquiries" className="text-xs text-[#667085] hover:text-[#182033] flex items-center gap-1 font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all inquiries</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details & Communication */}
        <div className="md:col-span-2 space-y-6">
          {/* Inquiry Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#182033]">#{inquiry.reference_number}</span>
                <div className="text-[11px] text-[#667085] mt-0.5">
                  Received on {new Date(inquiry.created_at).toLocaleString()}
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full font-bold capitalize text-xs ${
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

            {/* Customer info */}
            <div className="bg-gray-50/70 rounded-2xl p-4 border border-gray-100 mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#667085] mb-2">Customer Details</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#667085] block">Full Name:</span>
                  <span className="font-bold text-[#182033]">{inquiry.customer_name}</span>
                </div>
                <div>
                  <span className="text-[#667085] block">Phone Number:</span>
                  <span className="font-bold text-[#182033]">{inquiry.customer_phone}</span>
                </div>
                {inquiry.customer_telegram_username && (
                  <div>
                    <span className="text-[#667085] block">Telegram:</span>
                    <span className="font-bold text-[#3F51D7]">@{inquiry.customer_telegram_username}</span>
                  </div>
                )}
                <div>
                  <span className="text-[#667085] block">Preferred Contact:</span>
                  <span className="font-bold capitalize text-[#182033]">{inquiry.preferred_contact_method}</span>
                </div>
              </div>
              {inquiry.customer_note && (
                <div className="mt-3 pt-2.5 border-t border-gray-200/60 text-xs">
                  <span className="text-[#667085] block font-medium">Customer Note:</span>
                  <p className="text-[#182033] mt-0.5 italic">"{inquiry.customer_note}"</p>
                </div>
              )}
            </div>

            {/* Direct action buttons */}
            <div className="grid grid-cols-2 gap-3">
              {inquiry.customer_telegram_username && (
                <a
                  href={`https://t.me/${inquiry.customer_telegram_username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-4 rounded-xl bg-[#3F51D7] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#3142BD] transition shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Message on Telegram</span>
                </a>
              )}
              <a
                href={`tel:${inquiry.customer_phone}`}
                className="py-3 px-4 rounded-xl border border-[#E6E8EF] text-[#182033] font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-50 transition"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Call Customer</span>
              </a>
            </div>
          </div>

          {/* Immutable Snapshot Details */}
          <div className="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#667085] mb-3">Product Snapshot At Inquiry Time</h4>
            <div className="flex gap-4 items-center">
              <img
                src={inquiry.product_image_snapshot || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&auto=format&fit=crop'}
                alt={inquiry.product_name_snapshot}
                className="w-16 h-16 rounded-xl object-cover border border-gray-100"
              />
              <div className="text-xs space-y-1">
                <div className="font-bold text-sm text-[#182033]">{inquiry.product_name_snapshot}</div>
                {inquiry.variant_description_snapshot && (
                  <div className="text-[#667085]">
                    Variant: {inquiry.variant_description_snapshot}
                  </div>
                )}
                <div className="font-bold text-[#182033]">
                  Requested Quantity: {inquiry.quantity} &times; ${inquiry.unit_price_snapshot} = ${inquiry.subtotal_snapshot}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Update Status & Internal Notes */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#667085] mb-4">Inquiry Status Controls</h4>

            <form onSubmit={updateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#182033] mb-1">Update Status</label>
                <select
                  value={data.status}
                  onChange={(e) => setData('status', e.target.value)}
                  className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
                >
                  <option value="viewed">Viewed</option>
                  <option value="responded">Responded (Customer contacted)</option>
                  <option value="closed">Closed (Deal arranged or completed)</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#182033] mb-1">Status Comment / Reason</label>
                <input
                  value={data.comment}
                  onChange={(e) => setData('comment', e.target.value)}
                  type="text"
                  placeholder="e.g. Spoke on phone, delivery set for Friday"
                  className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#182033] mb-1">Manager Notes (Private)</label>
                <textarea
                  value={data.manager_notes}
                  onChange={(e) => setData('manager_notes', e.target.value)}
                  rows="3"
                  placeholder="Internal notes about price agreed, payment details, etc..."
                  className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-2.5 bg-[#3F51D7] text-white font-bold text-xs rounded-xl hover:bg-[#3142BD] transition shadow-xs disabled:opacity-50"
              >
                Update Status
              </button>
            </form>
          </div>

          {/* Audit History */}
          <div className="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#667085] mb-3">Status Timeline</h4>
            <div className="space-y-3">
              {inquiry.histories?.map((h) => (
                <div key={h.id} className="text-xs border-l-2 border-[#3F51D7] pl-3 py-0.5">
                  <div className="font-bold text-[#182033] capitalize">{{to_status: h.to_status}.to_status}</div>
                  <div className="text-[11px] text-[#667085]">{h.comment || 'Status change'}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{new Date(h.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ManagerLayout>
  );
}

