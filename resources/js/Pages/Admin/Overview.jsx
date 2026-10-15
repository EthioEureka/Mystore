import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import {
  Users,
  Store,
  Package,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function Overview({ metrics, pendingShops, recentInquiries, recentAuditLogs }) {
  const statCards = [
    {
      label: 'Registered Tenants',
      value: metrics.total_shops,
      subtext: `${metrics.approved_shops} active · ${metrics.pending_shops} pending`,
      icon: Store,
      color: 'from-blue-600 to-indigo-600',
      badgeColor: metrics.pending_shops > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800',
      badgeText: metrics.pending_shops > 0 ? `${metrics.pending_shops} Pending Review` : 'All Approved',
    },
    {
      label: 'Platform Users',
      value: metrics.total_users,
      subtext: 'Merchants, Staff & Admins',
      icon: Users,
      color: 'from-purple-600 to-violet-600',
      badgeColor: 'bg-purple-100 text-purple-800',
      badgeText: 'RBAC Active',
    },
    {
      label: 'Live Products',
      value: metrics.published_products,
      subtext: `Out of ${metrics.total_products} catalog items`,
      icon: Package,
      color: 'from-emerald-600 to-teal-600',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      badgeText: 'Multi-Store',
    },
    {
      label: 'Customer Inquiries',
      value: metrics.total_inquiries,
      subtext: `${metrics.closed_inquiries} completed transactions`,
      icon: MessageSquare,
      color: 'from-amber-500 to-orange-600',
      badgeColor: 'bg-blue-100 text-blue-800',
      badgeText: 'Zero-Payment Flow',
    },
  ];

  return (
    <AdminLayout
      title="Platform Operations Overview"
      subtitle="Real-time multi-tenant marketplace monitoring, shop onboarding & security audit logs"
    >
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-extrabold text-[#6B7280] uppercase tracking-wider">
                  {card.label}
                </span>
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="text-3xl font-black text-[#111827] tracking-tight">{card.value}</div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-[#6B7280] truncate font-medium">{card.subtext}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${card.badgeColor} shrink-0`}>
                  {card.badgeText}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Shop Onboarding & Moderation (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#111827]">Shops Awaiting Moderation</h3>
                  <p className="text-[11px] text-[#6B7280]">Stores submitted for activation</p>
                </div>
              </div>
              <Link
                href="/admin/shops"
                className="text-xs font-bold text-[#3F51D7] hover:underline flex items-center gap-1"
              >
                <span>View All Stores</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {!pendingShops || pendingShops.length === 0 ? (
              <div className="py-8 text-center rounded-2xl bg-gray-50/70 border border-dashed border-gray-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-[#111827]">All Shops Approved</p>
                <p className="text-[11px] text-[#6B7280] mt-0.5">There are no shops currently waiting for verification.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingShops.map((shop) => (
                  <div
                    key={shop.id}
                    className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 flex items-center justify-between hover:bg-gray-100/60 transition"
                  >
                    <div>
                      <div className="font-extrabold text-xs text-[#111827]">{shop.name}</div>
                      <div className="text-[11px] text-[#6B7280] mt-0.5">
                        Owner: {shop.owner?.name} &middot; <span className="font-mono">{shop.owner?.email}</span>
                      </div>
                    </div>
                    <Link
                      href="/admin/shops"
                      className="px-3.5 py-1.5 rounded-xl bg-[#3F51D7] text-white text-xs font-bold shadow-xs hover:bg-[#3142BD] transition"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Inquiries Activity */}
          <div className="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#3F51D7] flex items-center justify-center font-bold">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#111827]">Recent Purchase Inquiries</h3>
                  <p className="text-[11px] text-[#6B7280]">Latest customer requests across all tenants</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {recentInquiries?.map((inq) => (
                <div key={inq.id} className="p-3.5 rounded-2xl border border-gray-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#111827]">{inq.product_name_snapshot}</div>
                    <div className="text-[11px] text-[#6B7280]">
                      Shop: <span className="font-semibold text-gray-800">{inq.shop?.name}</span> &middot; By: {inq.customer_name} ({inq.customer_phone})
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-[#111827]">
                      ${inq.subtotal_snapshot}
                    </span>
                    <span className="block text-[10px] font-bold uppercase text-[#3F51D7] mt-0.5">
                      {inq.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Audit Logs & Platform Health (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Multi-Tenant Security & RBAC Status */}
          <div className="bg-gradient-to-br from-[#182033] to-[#0F1422] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-indigo-200">
                Tenant Isolation Active
              </span>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h4 className="text-base font-extrabold mb-1">Multi-Tenant RBAC Security</h4>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              Spatie role-based access control is actively scoped to each shop team. Store owners can manage their internal staff without data leakage across tenants.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] text-gray-400 uppercase font-bold">Registration Mode</div>
                <div className="font-extrabold mt-0.5 text-white">Admin-Provisioned</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] text-gray-400 uppercase font-bold">Admin Impersonation</div>
                <div className="font-extrabold mt-0.5 text-emerald-400">Enabled</div>
              </div>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-[#111827]">Security Audit Log</h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Latest Actions</span>
            </div>

            <div className="space-y-3">
              {recentAuditLogs?.map((log) => (
                <div key={log.id} className="text-xs pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-bold text-[#111827] capitalize">
                      {log.action.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {new Date(log.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6B7280]">
                    By: <span className="font-semibold text-gray-700">{log.user?.name || 'System'}</span> &middot; Target: {log.target_type} #{log.target_id}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
