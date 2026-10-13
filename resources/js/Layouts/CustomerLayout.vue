<template>
  <div class="min-h-screen bg-[#F6F7FB] text-[#182033] flex flex-col font-sans pb-20">
    <!-- Top Header Bar -->
    <header class="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E6E8EF] px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-xl bg-[#3F51D7] flex items-center justify-center text-white font-bold text-sm shadow-sm">
          TS
        </div>
        <div>
          <h1 class="text-sm font-bold tracking-tight text-[#182033] leading-none">
            {{ title || 'Telegram Marketplace' }}
          </h1>
          <p class="text-[11px] text-[#667085] flex items-center gap-1 mt-0.5">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-[#16845B]"></span>
            Direct shop contact &middot; No online payments
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <Link
          v-if="!$page.props.auth.user"
          href="/login"
          class="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#E6E8EF] text-[#182033] hover:bg-gray-50 transition"
        >
          Sign In
        </Link>
        <Link
          v-else-if="$page.props.auth.user.role === 'shop_owner'"
          href="/manager"
          class="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-[#3F51D7] text-white hover:bg-[#3142BD] transition shadow-xs"
        >
          Dashboard
        </Link>
        <Link
          v-else-if="$page.props.auth.user.role === 'admin'"
          href="/admin"
          class="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-[#182033] text-white hover:bg-black transition"
        >
          Admin
        </Link>
        <div v-else class="text-xs font-medium text-[#667085]">
          {{ $page.props.auth.user.name }}
        </div>
      </div>
    </header>

    <!-- Global Notice Banner -->
    <div class="bg-blue-50/70 border-b border-blue-100 px-4 py-1.5 text-xs text-blue-900 flex items-center justify-between">
      <div class="flex items-center gap-1.5 truncate">
        <span class="font-medium text-[11px] bg-blue-200/70 px-1.5 py-0.5 rounded text-blue-800">Notice</span>
        <span class="truncate">Final price, payment, and delivery are arranged directly with shops.</span>
      </div>
    </div>

    <!-- Main Content Slot -->
    <main class="flex-1 max-w-md mx-auto w-full px-4 pt-4">
      <slot />
    </main>

    <!-- Bottom Navigation Bar (Persistent mobile navigation) -->
    <nav class="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E6E8EF] max-w-md mx-auto">
      <div class="grid grid-cols-4 h-16">
        <Link
          href="/"
          class="flex flex-col items-center justify-center gap-1 text-xs font-medium transition"
          :class="$page.url === '/' ? 'text-[#3F51D7]' : 'text-[#667085] hover:text-[#182033]'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span>Home</span>
        </Link>

        <Link
          href="/search"
          class="flex flex-col items-center justify-center gap-1 text-xs font-medium transition"
          :class="$page.url.startsWith('/search') ? 'text-[#3F51D7]' : 'text-[#667085] hover:text-[#182033]'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <span>Search</span>
        </Link>

        <Link
          href="/saved"
          class="flex flex-col items-center justify-center gap-1 text-xs font-medium transition"
          :class="$page.url.startsWith('/saved') ? 'text-[#3F51D7]' : 'text-[#667085] hover:text-[#182033]'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
          <span>Saved</span>
        </Link>

        <Link
          href="/inquiries/history"
          class="flex flex-col items-center justify-center gap-1 text-xs font-medium transition"
          :class="$page.url.startsWith('/inquiries') ? 'text-[#3F51D7]' : 'text-[#667085] hover:text-[#182033]'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
          </svg>
          <span>Inquiries</span>
        </Link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { Link } from '@inertiajs/vue3';
import { onMounted } from 'vue';

defineProps({
  title: String,
});

onMounted(() => {
  // Telegram Mini Apps WebApp auto-expand and theme support
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    
    // Auto-authenticate customer if Telegram WebApp initData is present and user not authenticated
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
});
</script>
