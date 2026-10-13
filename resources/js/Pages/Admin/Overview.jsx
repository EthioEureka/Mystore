import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';

export default function Overview({ metrics, pendingShops, recentInquiries, recentAuditLogs }) {
  return (
    <AdminLayout title="Platform Overview">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
          <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider block">Total Users</span>
          <div className="text-3xl font-black text-[#182033] mt-1">{metrics.total_users}</div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
          <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider block">Active Shops</span>
          <div className="text-3xl font-black text-[#182033] mt-1">{metrics.approved_shops}</div>
          <span className="text-[11px] text-amber-600 font-semibold">{metrics.pending_shops} pending approval</span>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
          <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider block">Catalog Products</span>
          <div className="text-3xl font-black text-[#182033] mt-1">{metrics.total_products}</div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
          <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider block">Total Inquiries</span>
          <div className="text-3xl font-black text-[#182033] mt-1">{metrics.total_inquiries}</div>
        </div>
      </div>

      {/* 2 Column Section: Pending Shops & Recent Audit Logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
          <h3 className="text-sm font-bold text-[#182033] mb-4">Shops Awaiting Moderation</h3>
          {!pendingShops || pendingShops.length === 0 ? (
            <div className="text-xs text-[#667085]">
              No shops pending review at this time.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingShops.map((shop) => (
                <div key={shop.id} className="p-3 border border-gray-100 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#182033]">{shop.name}</div>
                    <div className="text-[11px] text-[#667085]">Owner: {shop.owner?.name} ({shop.owner?.email})</div>
                  </div>
                  <Link href="/admin/shops" className="text-xs font-semibold text-[#3F51D7] hover:underline">
                    Review &rarr;
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
          <h3 className="text-sm font-bold text-[#182033] mb-4">Recent Audit Logs</h3>
          <div className="space-y-2.5">
            {recentAuditLogs?.map((log) => (
              <div key={log.id} className="text-xs border-b border-gray-100 pb-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#182033] capitalize">{log.action.replace(/_/g, ' ')}</span>
                  <span className="text-[10px] text-gray-400">{new Date(log.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-[11px] text-[#667085]">
                  By: {log.user?.name || 'System'} &middot; Target: {log.target_type} #{log.target_id}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

