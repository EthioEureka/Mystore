<template>
  <div class="min-h-screen bg-[#F6F7FB] flex">
    <!-- Desktop Sidebar (260px) -->
    <aside class="w-64 bg-white border-r border-[#E6E8EF] flex flex-col fixed inset-y-0 z-30 hidden md:flex">
      <!-- App Brand -->
      <div class="h-16 flex items-center gap-2.5 px-6 border-b border-[#E6E8EF]">
        <div class="w-8 h-8 rounded-xl bg-[#3F51D7] flex items-center justify-center text-white font-bold text-sm shadow-sm">
          SM
        </div>
        <div class="truncate">
          <div class="text-sm font-bold text-[#182033] truncate">SellMate</div>
          <div class="text-[11px] text-[#667085] truncate">{{ shop?.name || 'Shop Manager' }}</div>
        </div>
      </div>

      <!-- Navigation Links -->
      <div class="flex-1 py-4 px-3 space-y-1">
        <Link
          href="/manager"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition"
          :class="$page.url === '/manager' ? 'bg-[#EEF0FD] text-[#3F51D7] font-semibold' : 'text-[#667085] hover:bg-gray-50 hover:text-[#182033]'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
          Dashboard
        </Link>

        <Link
          href="/manager/products"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition"
          :class="$page.url.startsWith('/manager/products') ? 'bg-[#EEF0FD] text-[#3F51D7] font-semibold' : 'text-[#667085] hover:bg-gray-50 hover:text-[#182033]'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
          Products
        </Link>

        <Link
          href="/manager/inquiries"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition"
          :class="$page.url.startsWith('/manager/inquiries') ? 'bg-[#EEF0FD] text-[#3F51D7] font-semibold' : 'text-[#667085] hover:bg-gray-50 hover:text-[#182033]'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          Inquiries
        </Link>

        <Link
          href="/manager/inventory"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition"
          :class="$page.url.startsWith('/manager/inventory') ? 'bg-[#EEF0FD] text-[#3F51D7] font-semibold' : 'text-[#667085] hover:bg-gray-50 hover:text-[#182033]'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
          Inventory
        </Link>

        <Link
          href="/manager/settings"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition"
          :class="$page.url.startsWith('/manager/settings') ? 'bg-[#EEF0FD] text-[#3F51D7] font-semibold' : 'text-[#667085] hover:bg-gray-50 hover:text-[#182033]'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          Settings
        </Link>
      </div>

      <!-- User footer -->
      <div class="p-4 border-t border-[#E6E8EF] flex items-center justify-between">
        <div class="truncate">
          <div class="text-xs font-semibold text-[#182033] truncate">{{ $page.props.auth.user.name }}</div>
          <div class="text-[11px] text-[#667085] truncate">Manager</div>
        </div>
        <Link method="post" as="button" href="/logout" class="text-xs text-red-600 hover:underline">
          Logout
        </Link>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 md:pl-64 flex flex-col min-h-screen">
      <!-- Top Bar -->
      <header class="h-16 bg-white border-b border-[#E6E8EF] px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
        <div class="flex items-center gap-3">
          <h2 class="text-lg font-bold text-[#182033]">{{ title }}</h2>
          <span class="text-xs px-2.5 py-0.5 rounded-full font-medium"
            :class="shop?.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'">
            {{ shop?.status === 'approved' ? 'Active Store' : 'Pending Approval' }}
          </span>
        </div>

        <div class="flex items-center gap-4">
          <a
            v-if="shop?.slug"
            :href="`/shops/${shop.slug}`"
            target="_blank"
            class="text-xs font-semibold text-[#3F51D7] hover:underline flex items-center gap-1"
          >
            <span>View Public Storefront</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </a>
        </div>
      </header>

      <!-- Flash Messages -->
      <div v-if="$page.props.flash.success" class="m-4 md:mx-8 mb-0 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
        <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
        <span>{{ $page.props.flash.success }}</span>
      </div>

      <div v-if="$page.props.flash.error" class="m-4 md:mx-8 mb-0 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
        <svg class="w-4 h-4 text-red-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
        <span>{{ $page.props.flash.error }}</span>
      </div>

      <!-- Main Slot -->
      <main class="flex-1 p-4 md:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { Link } from '@inertiajs/vue3';

defineProps({
  title: String,
  shop: Object,
});
</script>
