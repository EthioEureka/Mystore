import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';

export default function AdminShops({ shops }) {
  function updateStatus(shopId, status) {
    const reason = prompt(`Enter moderation reason for setting status to ${status} (optional):`);
    router.put(`/admin/shops/${shopId}/status`, { status, reason });
  }

  return (
    <AdminLayout title="Shops Moderation">
      <div className="bg-white rounded-3xl border border-[#E6E8EF] shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#E6E8EF] bg-gray-50/75 text-[#667085]">
              <th className="py-3.5 px-5 font-semibold">Shop Name</th>
              <th className="py-3.5 px-5 font-semibold">Owner</th>
              <th className="py-3.5 px-5 font-semibold">Category</th>
              <th className="py-3.5 px-5 font-semibold">Products</th>
              <th className="py-3.5 px-5 font-semibold">Inquiries</th>
              <th className="py-3.5 px-5 font-semibold">Status</th>
              <th className="py-3.5 px-5 font-semibold text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {shops.data?.map((shop) => (
              <tr key={shop.id} className="hover:bg-gray-50/50">
                <td className="py-3.5 px-5">
                  <div className="font-bold text-[#182033]">{shop.name}</div>
                  <div className="text-[11px] text-[#667085]">/shops/{shop.slug}</div>
                </td>
                <td className="py-3.5 px-5">
                  <div>{shop.owner?.name}</div>
                  <div className="text-[11px] text-[#667085]">{shop.owner?.email}</div>
                </td>
                <td className="py-3.5 px-5">{shop.category?.name || 'General'}</td>
                <td className="py-3.5 px-5">{shop.products_count}</td>
                <td className="py-3.5 px-5">{shop.inquiries_count}</td>
                <td className="py-3.5 px-5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full capitalize text-[10px] font-semibold ${
                      shop.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : shop.status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : shop.status === 'suspended'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {shop.status}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-right space-x-2">
                  {shop.status !== 'approved' && (
                    <button
                      onClick={() => updateStatus(shop.id, 'approved')}
                      className="text-emerald-600 font-semibold hover:underline"
                    >
                      Approve
                    </button>
                  )}
                  {shop.status !== 'suspended' && (
                    <button
                      onClick={() => updateStatus(shop.id, 'suspended')}
                      className="text-amber-600 font-semibold hover:underline"
                    >
                      Suspend
                    </button>
                  )}
                  <a
                    href={`/shops/${shop.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#3F51D7] font-semibold hover:underline"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

