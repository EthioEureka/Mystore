<template>
  <CustomerLayout title="Inquiry Sent">
    <div class="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs text-center mb-5">
      <!-- Success Badge -->
      <div class="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
      </div>

      <h2 class="text-lg font-bold text-[#182033]">Inquiry Sent Successfully!</h2>
      <p class="text-xs text-[#667085] mt-1 max-w-xs mx-auto">
        Your purchase request has been submitted to <strong>{{ shop.name }}</strong>.
      </p>

      <!-- Reference Badge -->
      <div class="my-4 p-3 bg-gray-50 rounded-2xl border border-gray-100 inline-block">
        <span class="text-[11px] text-[#667085] uppercase tracking-wider block">Reference Number</span>
        <span class="text-sm font-mono font-bold text-[#182033]">{{ inquiry.reference_number }}</span>
      </div>

      <!-- Snapshot details -->
      <div class="text-left bg-gray-50/70 rounded-2xl p-4 border border-gray-100 text-xs space-y-2 mb-4">
        <div class="flex justify-between">
          <span class="text-[#667085]">Product:</span>
          <span class="font-bold text-[#182033]">{{ inquiry.product_name_snapshot }}</span>
        </div>
        <div v-if="inquiry.variant_description_snapshot" class="flex justify-between">
          <span class="text-[#667085]">Variant:</span>
          <span class="font-medium text-[#182033]">{{ inquiry.variant_description_snapshot }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-[#667085]">Quantity:</span>
          <span class="font-medium text-[#182033]">{{ inquiry.quantity }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-[#667085]">Snapshot Price:</span>
          <span class="font-bold text-[#182033]">
            {{ inquiry.unit_price_snapshot ? `$${inquiry.unit_price_snapshot}` : 'Price on request' }}
          </span>
        </div>
      </div>

      <!-- Clear Non-Payment Reminder -->
      <div class="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-[11px] text-amber-900 text-left leading-relaxed mb-5">
        <strong>Next Steps:</strong> The shop owner will contact you directly to confirm availability, final price, delivery location, and payment. <strong>No payment has been collected by this platform.</strong>
      </div>

      <!-- Direct Contact CTA buttons -->
      <div class="space-y-2.5">
        <a
          v-if="shop.public_telegram_username"
          :href="`https://t.me/${shop.public_telegram_username}`"
          target="_blank"
          class="w-full py-3 bg-[#3F51D7] hover:bg-[#3142BD] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition"
        >
          <span>💬 Message Shop on Telegram (@{{ shop.public_telegram_username }})</span>
        </a>

        <a
          v-if="shop.public_phone"
          :href="`tel:${shop.public_phone}`"
          class="w-full py-3 bg-white border border-[#E6E8EF] hover:bg-gray-50 text-[#182033] font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition"
        >
          <span>📞 Call Shop ({{ shop.public_phone }})</span>
        </a>

        <Link
          href="/inquiries/history"
          class="w-full py-2.5 text-xs font-semibold text-[#667085] hover:text-[#182033] block text-center"
        >
          View My Inquiries &rarr;
        </Link>
      </div>
    </div>
  </CustomerLayout>
</template>

<script setup>
import CustomerLayout from '@/Layouts/CustomerLayout.vue';
import { Link } from '@inertiajs/vue3';

defineProps({
  inquiry: Object,
  shop: Object,
});
</script>
