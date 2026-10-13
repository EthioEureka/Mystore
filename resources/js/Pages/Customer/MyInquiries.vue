<template>
  <CustomerLayout title="My Inquiries">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-sm font-bold text-[#182033]">Inquiry History</h3>
      <span class="text-xs text-[#667085]">{{ inquiries.data?.length || 0 }} inquiries</span>
    </div>

    <!-- Empty state -->
    <div v-if="!inquiries.data || inquiries.data.length === 0" class="bg-white rounded-3xl p-8 border border-[#E6E8EF] text-center shadow-xs">
      <div class="text-3xl mb-2">📋</div>
      <h4 class="text-sm font-bold text-[#182033]">No Inquiries Found</h4>
      <p class="text-xs text-[#667085] mt-1 max-w-xs mx-auto">
        When you submit a contact or purchase inquiry, its status and merchant details will appear here.
      </p>
      <Link
        href="/"
        class="inline-block mt-4 px-4 py-2 bg-[#3F51D7] text-white text-xs font-semibold rounded-xl hover:bg-[#3142BD]"
      >
        Explore Products
      </Link>
    </div>

    <!-- Inquiry List -->
    <div v-else class="space-y-3">
      <div
        v-for="inquiry in inquiries.data"
        :key="inquiry.id"
        class="bg-white rounded-2xl p-4 border border-[#E6E8EF] shadow-xs"
      >
        <div class="flex items-center justify-between pb-2.5 border-b border-gray-100 mb-2.5">
          <span class="text-xs font-mono font-bold text-[#182033]">#{{ inquiry.reference_number }}</span>
          <span
            class="text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize"
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
        </div>

        <div class="flex gap-3 items-center mb-3">
          <div class="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
            <img
              v-if="inquiry.product_image_snapshot"
              :src="inquiry.product_image_snapshot"
              class="w-full h-full object-cover"
            />
            <span v-else class="text-xs">📦</span>
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-xs font-bold text-[#182033] truncate">{{ inquiry.product_name_snapshot }}</h4>
            <p class="text-[11px] text-[#667085] truncate">Shop: {{ inquiry.shop?.name }}</p>
            <div class="text-[11px] font-medium text-[#182033] mt-0.5">
              Qty: {{ inquiry.quantity }} &middot; {{ inquiry.unit_price_snapshot ? `$${inquiry.unit_price_snapshot}` : 'On request' }}
            </div>
          </div>
        </div>

        <!-- Action row -->
        <div class="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <a
              v-if="inquiry.shop?.public_telegram_username"
              :href="`https://t.me/${inquiry.shop.public_telegram_username}`"
              target="_blank"
              class="text-[#3F51D7] font-semibold hover:underline flex items-center gap-1"
            >
              <span>💬 Telegram</span>
            </a>
            <a
              v-if="inquiry.shop?.public_phone"
              :href="`tel:${inquiry.shop.public_phone}`"
              class="text-[#667085] font-semibold hover:underline flex items-center gap-1 ml-2"
            >
              <span>📞 Call</span>
            </a>
          </div>

          <button
            v-if="['sent', 'viewed'].includes(inquiry.status)"
            @click="cancelInquiry(inquiry.reference_number)"
            class="text-red-500 hover:underline text-[11px] font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </CustomerLayout>
</template>

<script setup>
import CustomerLayout from '@/Layouts/CustomerLayout.vue';
import { Link, router } from '@inertiajs/vue3';

defineProps({
  inquiries: Object,
});

function cancelInquiry(ref) {
  if (confirm('Are you sure you want to cancel this purchase inquiry?')) {
    router.post(`/inquiries/${ref}/cancel`);
  }
}
</script>
