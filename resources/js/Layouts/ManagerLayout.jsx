import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Package, MessageSquare, ClipboardCheck, Settings, ExternalLink } from 'lucide-react';

export default function ManagerLayout({ title, shop, children }) {
  const { auth, flash } = usePage().props;
  const currentUrl = window.location.pathname;

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex">
      {/* Desktop Sidebar (260px) */}
      <aside className="w-64 bg-white border-r border-[#E6E8EF] flex flex-col fixed inset-y-0 z-30 hidden md:flex">
        {/* App Brand */}
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-[#E6E8EF]">
          <div className="w-8 h-8 rounded-xl bg-[#3F51D7] flex items-center justify-center text-white font-bold text-sm shadow-sm">
            SM
          </div>
          <div className="truncate">
            <div className="text-sm font-bold text-[#182033] truncate">SellMate</div>
            <div className="text-[11px] text-[#667085] truncate">{shop?.name || 'Shop Manager'}</div>
          </div>
        </div>

        {/* Navigation Links */}
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
        </div>

        {/* User footer */}
        <div className="p-4 border-t border-[#E6E8EF] flex items-center justify-between">
          <div className="truncate">
            <div className="text-xs font-semibold text-[#182033] truncate">{auth?.user?.name}</div>
            <div className="text-[11px] text-[#667085] truncate">Manager</div>
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
              {shop?.status === 'approved' ? 'Active Store' : 'Pending Approval'}
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

        {/* Main Slot */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

