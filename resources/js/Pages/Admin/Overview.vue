<template>
  <AdminLayout title="Platform Overview">
    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-8">
      <div class="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
        <span class="text-xs font-semibold text-[#667085] uppercase tracking-wider block">Total Users</span>
        <div class="text-3xl font-black text-[#182033] mt-1">{{ metrics.total_users }}</div>
      </div>
      <div class="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
        <span class="text-xs font-semibold text-[#667085] uppercase tracking-wider block">Active Shops</span>
        <div class="text-3xl font-black text-[#182033] mt-1">{{ metrics.approved_shops }}</div>
        <span class="text-[11px] text-amber-600 font-semibold">{{ metrics.pending_shops }} pending approval</span>
      </div>
      <div class="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
        <span class="text-xs font-semibold text-[#667085] uppercase tracking-wider block">Catalog Products</span>
        <div class="text-3xl font-black text-[#182033] mt-1">{{ metrics.total_products }}</div>
      </div>
      <div class="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
        <span class="text-xs font-semibold text-[#667085] uppercase tracking-wider block">Total Inquiries</span>
        <div class="text-3xl font-black text-[#182033] mt-1">{{ metrics.total_inquiries }}</div>
      </div>
    </div>

    <!-- 2 Column Section: Pending Shops & Recent Audit Logs -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
        <h3 class="text-sm font-bold text-[#182033] mb-4">Shops Awaiting Moderation</h3>
        <div v-if="!pendingShops?.length" class="text-xs text-[#667085]">
          No shops pending review at this time.
        </div>
        <div v-else class="space-y-3">
          <div v-for="shop in pendingShops" :key="shop.id" class="p-3 border border-gray-100 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <div class="font-bold text-[#182033]">{{ shop.name }}</div>
              <div class="text-[11px] text-[#667085]">Owner: {{ shop.owner?.name }} ({{ shop.owner?.email }})</div>
            </div>
            <Link href="/admin/shops" class="text-xs font-semibold text-[#3F51D7] hover:underline">
              Review &rarr;
            </Link>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
        <h3 class="text-sm font-bold text-[#182033] mb-4">Recent Audit Logs</h3>
        <div class="space-y-2.5">
          <div v-for="log in recentAuditLogs" :key="log.id" class="text-xs border-b border-gray-100 pb-2">
            <div class="flex justify-between items-center">
              <span class="font-bold text-[#182033] capitalize">{{ log.action.replace('_', ' ') }}</span>
              <span class="text-[10px] text-gray-400">{{ new Date(log.created_at).toLocaleDateString() }}</span>
            </div>
            <div class="text-[11px] text-[#667085]">
              By: {{ log.user?.name || 'System' }} &middot; Target: {{ log.target_type }} #{{ log.target_id }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { Link } from '@inertiajs/vue3';

defineProps({
  metrics: Object,
  pendingShops: Array,
  recentInquiries: Array,
  recentAuditLogs: Array,
});
</script>
