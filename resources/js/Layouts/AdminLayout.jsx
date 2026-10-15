import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  Shield,
  Store,
  Tag,
  Users,
  Sliders,
  ExternalLink,
  ChevronDown,
  LayoutDashboard,
  Search,
  Bell,
  LogOut,
  Layers,
  Sparkles,
  Command,
  ArrowUpRight,
} from 'lucide-react';

export default function AdminLayout({ title, subtitle, children }) {
  const { auth, flash } = usePage().props;
  const currentUrl = window.location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Shops & Tenants', href: '/admin/shops', icon: Store },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'Platform Users', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-[#F6F8FC] text-[#111827] flex font-sans antialiased selection:bg-[#3F51D7] selection:text-white">
      {/* Premium Dark Glass Sidebar */}
      <aside className="w-68 bg-[#0F1422] text-white flex flex-col fixed inset-y-0 z-30 hidden lg:flex border-r border-[#1E2638] shadow-2xl">
        {/* Brand header */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-[#1E2638]">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3F51D7] to-[#707FFA] flex items-center justify-center text-white font-black text-lg shadow-lg shadow-[#3F51D7]/30 ring-1 ring-white/20">
            TS
          </div>
          <div className="min-w-0">
            <div className="text-sm font-extrabold tracking-tight flex items-center gap-1.5">
              <span>SaaS Portal</span>
              <span className="px-1.5 py-0.5 rounded-md bg-[#3F51D7]/30 text-[#9AA5FF] text-[9px] font-black uppercase tracking-wider border border-[#3F51D7]/40">
                PRO
              </span>
            </div>
            <div className="text-[11px] text-gray-400 truncate">Multi-Tenant Admin</div>
          </div>
        </div>

        {/* Quick stat badge */}
        <div className="px-4 py-3">
          <div className="p-3 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] backdrop-blur-xs flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-gray-300 font-medium text-[11px]">Core Status</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Live & Secure
            </span>
          </div>
        </div>

        {/* Main navigation */}
        <div className="flex-1 py-2 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
            Management
          </div>
          {navigation.map((item) => {
            const isActive = item.exact
              ? currentUrl === item.href
              : currentUrl.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#3F51D7] text-white shadow-md shadow-[#3F51D7]/30 font-bold'
                    : 'text-gray-300 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
              </Link>
            );
          })}
        </div>

        {/* Admin user profile footer */}
        <div className="p-4 border-t border-[#1E2638] bg-[#0A0E18]/60 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                {auth?.user?.name?.substring(0, 2)?.toUpperCase() || 'AD'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">{auth?.user?.name}</div>
                <div className="text-[10px] text-gray-400 truncate">Super Administrator</div>
              </div>
            </div>
            <Link
              method="post"
              as="button"
              href="/logout"
              className="p-2 text-gray-400 hover:text-rose-400 hover:bg-white/[0.05] rounded-xl transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-68 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-[#E6E8EF] px-6 lg:px-10 flex items-center justify-between sticky top-0 z-20 transition-all">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-black text-[#111827] tracking-tight">{title}</h1>
              {subtitle && <p className="text-xs text-[#6B7280] font-medium mt-0.5">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
            >
              <span>Customer Storefront</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-gray-500" />
            </Link>
          </div>
        </header>

        {/* Global Flashes */}
        {flash?.success && (
          <div className="mx-6 lg:mx-10 mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-xs">
            <span>{flash.success}</span>
          </div>
        )}
        {flash?.error && (
          <div className="mx-6 lg:mx-10 mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold flex items-center justify-between shadow-xs">
            <span>{flash.error}</span>
          </div>
        )}
        {flash?.info && (
          <div className="mx-6 lg:mx-10 mt-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold flex items-center justify-between shadow-xs">
            <span>{flash.info}</span>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
