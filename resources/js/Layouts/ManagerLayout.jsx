import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  ClipboardCheck,
  Settings,
  Users,
  ExternalLink,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';

export default function ManagerLayout({ title, shop, children }) {
  const { auth, flash } = usePage().props;
  const currentUrl = window.location.pathname;
  const isImpersonating = auth?.user?.is_impersonating || false;

  const permissions = auth?.user?.permissions || [];
  const isAdmin = auth?.user?.role === 'admin' || permissions.includes('*');

  const canManageUsers = isAdmin || permissions.includes('view shop users');
  const canManageProducts = isAdmin || permissions.includes('view products');
  const canManageInventory = isAdmin || permissions.includes('view inventory');
  const canManageInquiries = isAdmin || permissions.includes('view inquiries');
  const canManageSettings = isAdmin || permissions.includes('view shop settings');

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex flex-col">
      {/* Admin Impersonation Banner if active */}
      {isImpersonating && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>
              Admin Impersonation Mode: You are managing <strong>{shop?.name}</strong> as Platform Administrator.
            </span>
          </div>
          <Link
            method="post"
            as="button"
            href="/admin/shops/leave-impersonation"
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white font-bold transition flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Admin Console</span>
          </Link>
        </div>
      )}

      <div className="flex-1 flex">
        {/* Desktop Sidebar (260px) */}
        <aside className="w-64 bg-white border-r border-[#E6E8EF] flex flex-col fixed inset-y-0 z-30 hidden md:flex" style={{ top: isImpersonating ? '36px' : '0' }}>
          {/* Shop Brand Header */}
          <div className="h-16 flex items-center gap-2.5 px-6 border-b border-[#E6E8EF]">
            <div className="w-8 h-8 rounded-xl bg-[#3F51D7] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {shop?.name?.substring(0, 2)?.toUpperCase() || 'SM'}
            </div>
            <div className="truncate">
              <div className="text-sm font-bold text-[#182033] truncate">{shop?.name || 'Shop Manager'}</div>
              <div className="text-[11px] text-[#667085] truncate capitalize">
                {auth?.user?.is_impersonating ? 'Admin View' : (auth?.user?.role || 'Merchant')}
              </div>
            </div>
          </div>

          {/* Navigation Links with RBAC checks */}
          <div className="flex-1 py-4 px-3 space-y-1">
            <Link
              href="/manager"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                currentUrl === '/manager'
                  ? 'bg-[#EEF0FD] text-[#3F51D7] font-semibold'
                  : 'text-[#667085] hover:bg-gray-50 hover:text-[#182033]'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>

            {canManageProducts && (
              <Link
                href="/manager/products"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  currentUrl.startsWith('/manager/products')
                    ? 'bg-[#EEF0FD] text-[#3F51D7] font-semibold'
                    : 'text-[#667085] hover:bg-gray-50 hover:text-[#182033]'
                }`}
              >
                <Package className="w-5 h-5" />
                Products
              </Link>
            )}

            {canManageInquiries && (
              <Link
                href="/manager/inquiries"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  currentUrl.startsWith('/manager/inquiries')
                    ? 'bg-[#EEF0FD] text-[#3F51D7] font-semibold'
                    : 'text-[#667085] hover:bg-gray-50 hover:text-[#182033]'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                Inquiries
              </Link>
            )}

            {canManageInventory && (
              <Link
                href="/manager/inventory"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  currentUrl.startsWith('/manager/inventory')
                    ? 'bg-[#EEF0FD] text-[#3F51D7] font-semibold'
                    : 'text-[#667085] hover:bg-gray-50 hover:text-[#182033]'
                }`}
              >
                <ClipboardCheck className="w-5 h-5" />
                Inventory
              </Link>
            )}

            {canManageUsers && (
              <Link
                href="/manager/users"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  currentUrl.startsWith('/manager/users')
                    ? 'bg-[#EEF0FD] text-[#3F51D7] font-semibold'
                    : 'text-[#667085] hover:bg-gray-50 hover:text-[#182033]'
                }`}
              >
                <Users className="w-5 h-5" />
                Staff & Roles (RBAC)
              </Link>
            )}

            {canManageSettings && (
              <Link
                href="/manager/settings"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  currentUrl.startsWith('/manager/settings')
                    ? 'bg-[#EEF0FD] text-[#3F51D7] font-semibold'
                    : 'text-[#667085] hover:bg-gray-50 hover:text-[#182033]'
                }`}
              >
                <Settings className="w-5 h-5" />
                Settings
              </Link>
            )}
          </div>

          {/* User footer */}
          <div className="p-4 border-t border-[#E6E8EF] flex items-center justify-between">
            <div className="truncate">
              <div className="text-xs font-semibold text-[#182033] truncate">{auth?.user?.name}</div>
              <div className="text-[11px] text-[#667085] truncate capitalize">
                {auth?.user?.role?.replace('_', ' ') || 'Staff'}
              </div>
            </div>
            <Link method="post" as="button" href="/logout" className="text-xs text-red-600 hover:underline">
              Logout
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
          {/* Top Bar */}
          <header className="h-16 bg-white border-b border-[#E6E8EF] px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-[#182033]">{title}</h2>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  shop?.status === 'approved'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {shop?.status === 'approved' ? 'Active Tenant' : 'Pending Approval'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {shop?.slug && (
                <a
                  href={`/shops/${shop.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-[#3F51D7] hover:underline flex items-center gap-1"
                >
                  <span>View Public Storefront</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </header>

          {/* Flash Messages */}
          {flash?.success && (
            <div className="m-4 md:mx-8 mb-0 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <span>{flash.success}</span>
            </div>
          )}
          {flash?.error && (
            <div className="m-4 md:mx-8 mb-0 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
              <span>{flash.error}</span>
            </div>
          )}
          {flash?.info && (
            <div className="m-4 md:mx-8 mb-0 p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-xl flex items-center gap-2">
              <span>{flash.info}</span>
            </div>
          )}

          {/* Main Slot */}
          <main className="flex-1 p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
