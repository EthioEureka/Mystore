import React, { useState } from 'react';
import ManagerLayout from '@/Layouts/ManagerLayout';
import { Link, router } from '@inertiajs/react';

export default function InquiriesIndex({ shop, inquiries, filters }) {
  const [search, setSearch] = useState(filters?.search || '');
  const [status, setStatus] = useState(filters?.status || '');

  function applyFilter(newStatus = status) {
    router.get('/manager/inquiries', { search, status: newStatus }, { preserveState: true });
  }

  return (
    <ManagerLayout title="Purchase Inquiries" shop={shop}>
      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
            type="text"
            placeholder="Search by customer, phone, ref..."
            className="bg-white border border-[#E6E8EF] rounded-xl px-3.5 py-2 text-xs focus:border-[#3F51D7] outline-none w-72 shadow-xs"
          />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              applyFilter(e.target.value);
            }}
            className="bg-white border border-[#E6E8EF] rounded-xl px-3 py-2 text-xs outline-none shadow-xs"
          >
            <option value="">All Statuses</option>
            <option value="sent">Sent (New)</option>
            <option value="viewed">Viewed</option>
            <option value="responded">Responded</option>
            <option value="closed">Closed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Inquiries List Table */}
      <div className="bg-white rounded-3xl border border-[#E6E8EF] shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#E6E8EF] bg-gray-50/75 text-[#667085]">
              <th className="py-3.5 px-5 font-semibold">Ref Number</th>
              <th className="py-3.5 px-5 font-semibold">Customer</th>
              <th className="py-3.5 px-5 font-semibold">Product</th>
              <th className="py-3.5 px-5 font-semibold">Quantity</th>
              <th className="py-3.5 px-5 font-semibold">Date Received</th>
              <th className="py-3.5 px-5 font-semibold">Status</th>
              <th className="py-3.5 px-5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inquiries.data?.map((inquiry) => (
              <tr key={inquiry.id} className="hover:bg-gray-50/50">
                <td className="py-3.5 px-5 font-mono font-bold text-[#182033]">#{inquiry.reference_number}</td>
                <td className="py-3.5 px-5">
                  <div className="font-bold text-[#182033]">{inquiry.customer_name}</div>
                  <div className="text-[11px] text-[#667085]">{inquiry.customer_phone}</div>
                </td>
                <td className="py-3.5 px-5 font-medium text-[#182033]">
                  <div>{inquiry.product_name_snapshot}</div>
                  {inquiry.variant_description_snapshot && (
                    <div className="text-[10px] text-[#667085]">
                      {inquiry.variant_description_snapshot}
                    </div>
                  )}
                </td>
                <td className="py-3.5 px-5">{inquiry.quantity}</td>
                <td className="py-3.5 px-5 text-[#667085]">
                  {new Date(inquiry.created_at).toLocaleDateString()}
                </td>
                <td className="py-3.5 px-5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-semibold capitalize text-[10px] ${
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
                </td>
                <td className="py-3.5 px-5 text-right">
                  <Link href={`/manager/inquiries/${inquiry.id}`} className="text-[#3F51D7] font-semibold hover:underline">
                    Manage &rarr;
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ManagerLayout>
  );
}

