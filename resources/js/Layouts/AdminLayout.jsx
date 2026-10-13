import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Shield, Store, Tag, Users, Sliders, ExternalLink } from 'lucide-react';

export default function AdminLayout({ title, children }) {
  const { auth } = usePage().props;
  const currentUrl = window.location.pathname;

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#182033] text-white flex flex-col fixed inset-y-0 z-30 hidden md:flex">
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-gray-800">
          <div className="w-8 h-8 rounded-xl bg-[#3F51D7] flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <div>
            <div className="text-sm font-bold">Admin Console</div>
            <div className="text-[11px] text-gray-400">Marketplace Ops</div>
          </div>
        </div>

        <div className="flex-1 py-4 px-3 space-y-1">
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              currentUrl === '/admin' ? 'bg-[#3F51D7] text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Shield className="w-5 h-5" />
            Overview
          </Link>
          <Link
            href="/admin/shops"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              currentUrl.startsWith('/admin/shops') ? 'bg-[#3F51D7] text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Store className="w-5 h-5" />
            Shops
          </Link>
          <Link
            href="/admin/categories"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              currentUrl.startsWith('/admin/categories') ? 'bg-[#3F51D7] text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Tag className="w-5 h-5" />
            Categories
          </Link>
          <Link
            href="/admin/users"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              currentUrl.startsWith('/admin/users') ? 'bg-[#3F51D7] text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Users className="w-5 h-5" />
            Users
          </Link>
          <Link
            href="/admin/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              currentUrl.startsWith('/admin/settings') ? 'bg-[#3F51D7] text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Sliders className="w-5 h-5" />
            Settings
          </Link>
        </div>

        <div className="p-4 border-t border-gray-800 flex items-center justify-between">
          <span className="text-xs text-gray-400">{auth?.user?.name}</span>
          <Link method="post" as="button" href="/logout" className="text-xs text-red-400 hover:underline">
            Logout
          </Link>
        </div>
      </aside>

      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-[#E6E8EF] px-8 flex items-center justify-between sticky top-0 z-20">
          <h2 className="text-lg font-bold text-[#182033]">{title}</h2>
          <Link href="/" className="text-xs font-semibold text-[#3F51D7] hover:underline flex items-center gap-1">
            <span>Go to Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </header>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

