<template>
  <ManagerLayout title="Purchase Inquiries" :shop="shop">
    <!-- Filter Bar -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <input
          v-model="search"
          @keyup.enter="applyFilter"
          type="text"
          placeholder="Search by customer, phone, ref..."
          class="bg-white border border-[#E6E8EF] rounded-xl px-3.5 py-2 text-xs focus:border-[#3F51D7] outline-none w-72 shadow-xs"
        />
        <select v-model="status" @change="applyFilter" class="bg-white border border-[#E6E8EF] rounded-xl px-3 py-2 text-xs outline-none shadow-xs">
          <option value="">All Statuses</option>
          <option value="sent">Sent (New)</option>
          <option value="viewed">Viewed</option>
          <option value="responded">Responded</option>
          <option value="closed">Closed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>

    <!-- Inquiries List Table -->
    <div class="bg-white rounded-3xl border border-[#E6E8EF] shadow-xs overflow-hidden">
      <table class="w-full text-left border-collapse text-xs">
        <thead>
          <tr class="border-b border-[#E6E8EF] bg-gray-50/75 text-[#667085]">
            <th class="py-3.5 px-5 font-semibold">Ref Number</th>
            <th class="py-3.5 px-5 font-semibold">Customer</th>
            <th class="py-3.5 px-5 font-semibold">Product</th>
            <th class="py-3.5 px-5 font-semibold">Quantity</th>
            <th class="py-3.5 px-5 font-semibold">Date Received</th>
            <th class="py-3.5 px-5 font-semibold">Status</th>
            <th class="py-3.5 px-5 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="inquiry in inquiries.data" :key="inquiry.id" class="hover:bg-gray-50/50">
            <td class="py-3.5 px-5 font-mono font-bold text-[#182033]">#{{ inquiry.reference_number }}</td>
            <td class="py-3.5 px-5">
              <div class="font-bold text-[#182033]">{{ inquiry.customer_name }}</div>
              <div class="text-[11px] text-[#667085]">{{ inquiry.customer_phone }}</div>
            </td>
            <td class="py-3.5 px-5 font-medium text-[#182033]">
              <div>{{ inquiry.product_name_snapshot }}</div>
              <div v-if="inquiry.variant_description_snapshot" class="text-[10px] text-[#667085]">
                {{ inquiry.variant_description_snapshot }}
              </div>
            </td>
            <td class="py-3.5 px-5">{{ inquiry.quantity }}</td>
            <td class="py-3.5 px-5 text-[#667085]">
              {{ new Date(inquiry.created_at).toLocaleDateString() }}
            </td>
            <td class="py-3.5 px-5">
              <span
                class="px-2.5 py-0.5 rounded-full font-semibold capitalize text-[10px]"
                :class="{
                  'bg-blue-50 text-blue-700 border border-blue-200': inquiry.status === 'sent',
                  'bg-amber-50 text-amber-700 border border-amber-200': inquiry.status === 'viewed',
                  'bg-emerald-50 text-emerald-700 border border-emerald-200': inquiry.status === 'responded',
                  'bg-gray-100 text-gray-700': inquiry.status === 'closed',
                  'bg-red-50 text-red-700 border border-red-200': inquiry.status === 'cancelled',
                }"
              >
                {{ inquiry.status }}
              </span>
            </td>
            <td class="py-3.5 px-5 text-right">
              <Link :href="`/manager/inquiries/${inquiry.id}`" class="text-[#3F51D7] font-semibold hover:underline">
                Manage &rarr;
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
import { Link, router } from '@inertiajs/vue3';
import { ref } from 'vue';

const props = defineProps({
  shop: Object,
  inquiries: Object,
  filters: Object,
});

const search = ref(props.filters?.search || '');
const status = ref(props.filters?.status || '');

function applyFilter() {
  router.get('/manager/inquiries', { search: search.value, status: status.value }, { preserveState: true });
}
</script>
