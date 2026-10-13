<template>
  <AdminLayout title="Shops Moderation">
    <div class="bg-white rounded-3xl border border-[#E6E8EF] shadow-xs overflow-hidden">
      <table class="w-full text-left border-collapse text-xs">
        <thead>
          <tr class="border-b border-[#E6E8EF] bg-gray-50/75 text-[#667085]">
            <th class="py-3.5 px-5 font-semibold">Shop Name</th>
            <th class="py-3.5 px-5 font-semibold">Owner</th>
            <th class="py-3.5 px-5 font-semibold">Category</th>
            <th class="py-3.5 px-5 font-semibold">Products</th>
            <th class="py-3.5 px-5 font-semibold">Inquiries</th>
            <th class="py-3.5 px-5 font-semibold">Status</th>
            <th class="py-3.5 px-5 font-semibold text-right">Moderation Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="shop in shops.data" :key="shop.id" class="hover:bg-gray-50/50">
            <td class="py-3.5 px-5">
              <div class="font-bold text-[#182033]">{{ shop.name }}</div>
              <div class="text-[11px] text-[#667085]">/shops/{{ shop.slug }}</div>
            </td>
            <td class="py-3.5 px-5">
              <div>{{ shop.owner?.name }}</div>
              <div class="text-[11px] text-[#667085]">{{ shop.owner?.email }}</div>
            </td>
            <td class="py-3.5 px-5">{{ shop.category?.name || 'General' }}</td>
            <td class="py-3.5 px-5">{{ shop.products_count }}</td>
            <td class="py-3.5 px-5">{{ shop.inquiries_count }}</td>
            <td class="py-3.5 px-5">
              <span
                class="px-2.5 py-0.5 rounded-full capitalize text-[10px] font-semibold"
                :class="{
                  'bg-emerald-50 text-emerald-700 border border-emerald-200': shop.status === 'approved',
                  'bg-amber-50 text-amber-700 border border-amber-200': shop.status === 'pending',
                  'bg-rose-50 text-rose-700 border border-rose-200': shop.status === 'suspended',
                  'bg-gray-100 text-gray-700': shop.status === 'rejected',
                }"
              >
                {{ shop.status }}
              </span>
            </td>
            <td class="py-3.5 px-5 text-right space-x-2">
              <button
                v-if="shop.status !== 'approved'"
                @click="updateStatus(shop.id, 'approved')"
                class="text-emerald-600 font-semibold hover:underline"
              >
                Approve
              </button>
              <button
                v-if="shop.status !== 'suspended'"
                @click="updateStatus(shop.id, 'suspended')"
                class="text-amber-600 font-semibold hover:underline"
              >
                Suspend
              </button>
              <a
                :href="`/shops/${shop.slug}`"
                target="_blank"
                class="text-[#3F51D7] font-semibold hover:underline"
              >
                View
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { router } from '@inertiajs/vue3';

defineProps({
  shops: Object,
  filters: Object,
});

function updateStatus(shopId, status) {
  const reason = prompt(`Enter moderation reason for setting status to ${status} (optional):`);
  router.put(`/admin/shops/${shopId}/status`, { status, reason });
}
</script>
