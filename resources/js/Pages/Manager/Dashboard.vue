<template>
  <ManagerLayout title="Dashboard" :shop="shop">
    <!-- Stat Metrics Row matching SellMate Figma screenshot -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
      <div class="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs flex items-center justify-between">
        <div>
          <span class="text-xs font-semibold text-[#667085] uppercase tracking-wider block">Total Products</span>
          <div class="text-3xl font-black text-[#182033] mt-1">{{ metrics.total_products }}</div>
          <span class="text-[11px] font-semibold text-emerald-600 mt-1 inline-block">
            {{ metrics.published_products }} published
          </span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-[#3F51D7] flex items-center justify-center text-xl">
          📦
        </div>
      </div>

      <div class="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs flex items-center justify-between">
        <div>
          <span class="text-xs font-semibold text-[#667085] uppercase tracking-wider block">Purchase Inquiries</span>
          <div class="text-3xl font-black text-[#182033] mt-1">{{ metrics.total_inquiries }}</div>
          <span class="text-[11px] font-semibold text-amber-600 mt-1 inline-block">
            {{ metrics.new_inquiries }} awaiting response
          </span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
          💬
        </div>
      </div>

      <div class="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs flex items-center justify-between">
        <div>
          <span class="text-xs font-semibold text-[#667085] uppercase tracking-wider block">Low Stock Items</span>
          <div class="text-3xl font-black text-[#182033] mt-1">{{ metrics.low_stock_products }}</div>
          <span class="text-[11px] text-[#667085] mt-1 inline-block">
            Inventory monitoring
          </span>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl">
          ⚠️
        </div>
      </div>
    </div>

    <!-- Quick action links -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-base font-bold text-[#182033]">Recent Inquiries</h3>
      <div class="flex gap-2">
        <Link
          href="/manager/products/create"
          class="px-4 py-2 bg-[#3F51D7] text-white text-xs font-semibold rounded-xl hover:bg-[#3142BD] transition shadow-xs flex items-center gap-1.5"
        >
          <span>+ Add Product</span>
        </Link>
        <Link
          href="/manager/inquiries"
          class="px-4 py-2 border border-[#E6E8EF] bg-white text-[#182033] text-xs font-semibold rounded-xl hover:bg-gray-50 transition"
        >
          View All Inquiries &rarr;
        </Link>
      </div>
    </div>

    <!-- Recent Inquiries Table -->
    <div class="bg-white rounded-3xl border border-[#E6E8EF] shadow-xs overflow-hidden mb-8">
      <div v-if="!recentInquiries?.length" class="p-8 text-center text-xs text-[#667085]">
        No inquiries received yet. Once customers submit purchase requests, they appear here.
      </div>
      <table v-else class="w-full text-left border-collapse text-xs">
        <thead>
          <tr class="border-b border-[#E6E8EF] bg-gray-50/75 text-[#667085]">
            <th class="py-3 px-5 font-semibold">Reference</th>
            <th class="py-3 px-5 font-semibold">Customer</th>
            <th class="py-3 px-5 font-semibold">Product</th>
            <th class="py-3 px-5 font-semibold">Quantity</th>
            <th class="py-3 px-5 font-semibold">Status</th>
            <th class="py-3 px-5 font-semibold text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="inq in recentInquiries" :key="inq.id" class="hover:bg-gray-50/50">
            <td class="py-3.5 px-5 font-mono font-bold text-[#182033]">#{{ inq.reference_number }}</td>
            <td class="py-3.5 px-5">
              <div class="font-bold text-[#182033]">{{ inq.customer_name }}</div>
              <div class="text-[11px] text-[#667085]">{{ inq.customer_phone }}</div>
            </td>
            <td class="py-3.5 px-5 font-medium text-[#182033]">{{ inq.product_name_snapshot }}</td>
            <td class="py-3.5 px-5">{{ inq.quantity }}</td>
            <td class="py-3.5 px-5">
              <span
                class="px-2.5 py-0.5 rounded-full font-semibold capitalize text-[10px]"
                :class="{
                  'bg-blue-50 text-blue-700 border border-blue-200': inq.status === 'sent',
                  'bg-amber-50 text-amber-700 border border-amber-200': inq.status === 'viewed',
                  'bg-emerald-50 text-emerald-700 border border-emerald-200': inq.status === 'responded',
                  'bg-gray-100 text-gray-700': inq.status === 'closed',
                  'bg-red-50 text-red-700 border border-red-200': inq.status === 'cancelled',
                }"
              >
                {{ inq.status }}
              </span>
            </td>
            <td class="py-3.5 px-5 text-right">
              <Link :href="`/manager/inquiries/${inq.id}`" class="text-[#3F51D7] font-semibold hover:underline">
                View &rarr;
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </ManagerLayout>
</template>

<script setup>
import ManagerLayout from '@/Layouts/ManagerLayout.vue';
import { Link } from '@inertiajs/vue3';

defineProps({
  shop: Object,
  metrics: Object,
  recentInquiries: Array,
  recentProducts: Array,
});
</script>
