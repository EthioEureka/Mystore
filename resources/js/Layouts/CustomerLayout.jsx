import React, { useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Home, Search, Heart, ClipboardList, Store, Shield } from 'lucide-react';

export default function CustomerLayout({ title, children }) {
  const { auth, url } = usePage().props;

  useEffect(() => {
    // Telegram Mini Apps WebApp auto-expand and theme support
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      if (tg.initData && !window._tgAuthed) {
        window._tgAuthed = true;
        fetch('/api/telegram/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          },
          body: JSON.stringify({ initData: tg.initData })
        }).catch(err => console.log('Telegram auto-auth skipped/handled:', err));
      }
    }
  }, []);

  const currentUrl = window.location.pathname;

  return (
    <div className="min-h-screen bg-[#F6F7FB] text-[#182033] flex flex-col font-sans pb-20">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E6E8EF] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#3F51D7] flex items-center justify-center text-white font-bold text-sm shadow-sm">
            TS
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-[#182033] leading-none">
              {title || 'Telegram Marketplace'}
            </h1>
            <p className="text-[11px] text-[#667085] flex items-center gap-1 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#16845B]"></span>
              Direct shop contact &middot; No online payments
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!auth?.user ? (
            <Link
              href="/login"
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#E6E8EF] text-[#182033] hover:bg-gray-50 transition"
            >
              Sign In
            </Link>
          ) : auth.user.role === 'shop_owner' ? (
            <Link
              href="/manager"
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-[#3F51D7] text-white hover:bg-[#3142BD] transition shadow-xs flex items-center gap-1"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          ) : auth.user.role === 'admin' ? (
            <Link
              href="/admin"
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-[#182033] text-white hover:bg-black transition flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          ) : (
            <div className="text-xs font-medium text-[#667085]">
              {auth.user.name}
            </div>
          )}
        </div>
      </header>

      {/* Global Notice Banner */}
      <div className="bg-blue-50/70 border-b border-blue-100 px-4 py-1.5 text-xs text-blue-900 flex items-center justify-between">
        <div className="flex items-center gap-1.5 truncate">
          <span className="font-medium text-[11px] bg-blue-200/70 px-1.5 py-0.5 rounded text-blue-800">Notice</span>
          <span className="truncate">Final price, payment, and delivery are arranged directly with shops.</span>
        </div>
      </div>

      {/* Main Content Slot */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-4">
        {children}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E6E8EF] max-w-md mx-auto">
        <div className="grid grid-cols-4 h-16">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-1 text-xs font-medium transition ${
              currentUrl === '/' ? 'text-[#3F51D7]' : 'text-[#667085] hover:text-[#182033]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>

          <Link
            href="/search"
            className={`flex flex-col items-center justify-center gap-1 text-xs font-medium transition ${
              currentUrl.startsWith('/search') ? 'text-[#3F51D7]' : 'text-[#667085] hover:text-[#182033]'
            }`}
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </Link>

          <Link
            href="/saved"
            className={`flex flex-col items-center justify-center gap-1 text-xs font-medium transition ${
              currentUrl.startsWith('/saved') ? 'text-[#3F51D7]' : 'text-[#667085] hover:text-[#182033]'
            }`}
          >
            <Heart className="w-5 h-5" />
            <span>Saved</span>
          </Link>

          <Link
            href="/inquiries/history"
            className={`flex flex-col items-center justify-center gap-1 text-xs font-medium transition ${
              currentUrl.startsWith('/inquiries') ? 'text-[#3F51D7]' : 'text-[#667085] hover:text-[#182033]'
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            <span>Inquiries</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

