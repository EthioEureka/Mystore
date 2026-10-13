<template>
  <div class="min-h-screen bg-[#F6F7FB] flex">
    <!-- Admin Sidebar -->
    <aside class="w-64 bg-[#182033] text-white flex flex-col fixed inset-y-0 z-30 hidden md:flex">
      <div class="h-16 flex items-center gap-2.5 px-6 border-b border-gray-800">
        <div class="w-8 h-8 rounded-xl bg-[#3F51D7] flex items-center justify-center text-white font-bold text-sm">
          A
        </div>
        <div>
          <div class="text-sm font-bold">Admin Console</div>
          <div class="text-[11px] text-gray-400">Marketplace Ops</div>
        </div>
      </div>

      <div class="flex-1 py-4 px-3 space-y-1">
        <Link
          href="/admin"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition"
          :class="$page.url === '/admin' ? 'bg-[#3F51D7] text-white' : 'text-gray-300 hover:bg-gray-800'"
        >
          Overview
        </Link>
        <Link
          href="/admin/shops"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition"
          :class="$page.url.startsWith('/admin/shops') ? 'bg-[#3F51D7] text-white' : 'text-gray-300 hover:bg-gray-800'"
        >
          Shops
        </Link>
        <Link
          href="/admin/categories"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition"
          :class="$page.url.startsWith('/admin/categories') ? 'bg-[#3F51D7] text-white' : 'text-gray-300 hover:bg-gray-800'"
        >
          Categories
        </Link>
        <Link
          href="/admin/users"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition"
          :class="$page.url.startsWith('/admin/users') ? 'bg-[#3F51D7] text-white' : 'text-gray-300 hover:bg-gray-800'"
        >
          Users
        </Link>
        <Link
          href="/admin/settings"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition"
          :class="$page.url.startsWith('/admin/settings') ? 'bg-[#3F51D7] text-white' : 'text-gray-300 hover:bg-gray-800'"
        >
          Settings
        </Link>
      </div>

      <div class="p-4 border-t border-gray-800 flex items-center justify-between">
        <span class="text-xs text-gray-400">{{ $page.props.auth.user.name }}</span>
        <Link method="post" as="button" href="/logout" class="text-xs text-red-400 hover:underline">
          Logout
        </Link>
      </div>
    </aside>

    <div class="flex-1 md:pl-64 flex flex-col min-h-screen">
      <header class="h-16 bg-white border-b border-[#E6E8EF] px-8 flex items-center justify-between sticky top-0 z-20">
        <h2 class="text-lg font-bold text-[#182033]">{{ title }}</h2>
        <Link href="/" class="text-xs font-semibold text-[#3F51D7] hover:underline">
          Go to Storefront &rarr;
        </Link>
      </header>

      <main class="flex-1 p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { Link } from '@inertiajs/vue3';
defineProps({ title: String });
</script>
