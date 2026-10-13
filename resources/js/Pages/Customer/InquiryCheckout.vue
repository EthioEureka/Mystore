<template>
  <CustomerLayout title="Purchase Inquiry">
    <!-- Back to product -->
    <div class="mb-4">
      <Link :href="`/shops/${shop.slug}/products/${product.slug}`" class="text-xs text-[#667085] hover:text-[#182033] flex items-center gap-1 font-medium">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        <span>Back to product</span>
      </Link>
    </div>

    <!-- Inquiry Checkout Screen (No online payments) -->
    <div class="bg-white rounded-3xl p-5 border border-[#E6E8EF] shadow-xs mb-5">
      <div class="flex items-center gap-2 mb-3">
        <div class="w-6 h-6 rounded-lg bg-[#EEF0FD] text-[#3F51D7] flex items-center justify-center text-xs font-bold">
          1
        </div>
        <h3 class="text-sm font-bold text-[#182033]">Inquiry Summary</h3>
      </div>

      <!-- Item snapshot review -->
      <div class="flex gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100 mb-4">
        <img
          :src="product.primary_image?.image_path || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&auto=format&fit=crop'"
          :alt="product.name"
          class="w-16 h-16 object-cover rounded-xl bg-white border border-gray-100 shrink-0"
        />
        <div class="flex-1 min-w-0">
          <h4 class="text-xs font-bold text-[#182033] truncate">{{ product.name }}</h4>
          <p class="text-[11px] text-[#667085] truncate">Shop: {{ shop.name }}</p>
          <p v-if="selectedVariant" class="text-[11px] text-[#3F51D7] font-medium">
            Variant: {{ selectedVariant.name }}
          </p>
          <div class="mt-1 flex items-baseline justify-between">
            <span class="text-xs font-bold text-[#182033]">
              Qty: {{ form.quantity }} &times; ${{ unitPrice }}
            </span>
            <span class="text-xs font-extrabold text-[#182033]">
              ${{ estimatedTotal }}
            </span>
          </div>
        </div>
      </div>

      <!-- Clear Non-Payment Notice -->
      <div class="bg-blue-50/70 border border-blue-200/60 rounded-xl p-3 text-[11px] text-blue-900 leading-relaxed mb-4">
        <strong>ℹ️ No online payment required:</strong> This form creates a purchase request. The shop owner will contact you to verify stock, final total, delivery time, and payment method (cash on delivery, bank transfer, or in-person).
      </div>

      <!-- Contact details form -->
      <form @submit.prevent="submitInquiry" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-[#182033] mb-1">
            Your Full Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.customer_name"
            type="text"
            required
            placeholder="e.g. Dawit Tadesse"
            class="w-full text-xs bg-gray-50/50 border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:bg-white focus:border-[#3F51D7] focus:ring-1 focus:ring-[#3F51D7] outline-none"
          />
          <div v-if="form.errors.customer_name" class="text-[10px] text-red-500 mt-1">
            {{ form.errors.customer_name }}
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-[#182033] mb-1">
            Phone Number <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.customer_phone"
            type="tel"
            required
            placeholder="e.g. +251 91 123 4567"
            class="w-full text-xs bg-gray-50/50 border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:bg-white focus:border-[#3F51D7] focus:ring-1 focus:ring-[#3F51D7] outline-none"
          />
          <div v-if="form.errors.customer_phone" class="text-[10px] text-red-500 mt-1">
            {{ form.errors.customer_phone }}
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-[#182033] mb-1">
            Telegram Username (Optional)
          </label>
          <div class="relative">
            <span class="absolute left-3 top-2.5 text-[#667085] text-xs font-medium">@</span>
            <input
              v-model="form.customer_telegram_username"
              type="text"
              placeholder="username"
              class="w-full text-xs bg-gray-50/50 border border-[#E6E8EF] rounded-xl pl-7 pr-3 py-2.5 focus:bg-white focus:border-[#3F51D7] focus:ring-1 focus:ring-[#3F51D7] outline-none"
            />
          </div>
          <p class="text-[10px] text-[#667085] mt-1">
            Helps the shop owner reach you quickly inside Telegram.
          </p>
        </div>

        <div>
          <label class="block text-xs font-bold text-[#182033] mb-1">
            Preferred Contact Method
          </label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="method in ['telegram', 'phone', 'either']"
              :key="method"
              type="button"
              @click="form.preferred_contact_method = method"
              class="py-2 text-xs font-medium rounded-xl border text-center capitalize transition"
              :class="form.preferred_contact_method === method ? 'border-[#3F51D7] bg-[#EEF0FD] text-[#3F51D7] font-semibold' : 'border-[#E6E8EF] text-[#182033] hover:bg-gray-50'"
            >
              {{ method }}
            </button>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-[#182033] mb-1">
            Note for Shop (Optional)
          </label>
          <textarea
            v-model="form.customer_note"
            rows="2"
            placeholder="Preferred delivery address, size questions, or timing..."
            class="w-full text-xs bg-gray-50/50 border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:bg-white focus:border-[#3F51D7] focus:ring-1 focus:ring-[#3F51D7] outline-none resize-none"
          ></textarea>
        </div>

        <!-- Mandatory offline arrangement checkbox -->
        <label class="flex items-start gap-2.5 p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer">
          <input
            v-model="form.acknowledges_offline_sale"
            type="checkbox"
            required
            class="mt-0.5 rounded text-[#3F51D7] focus:ring-[#3F51D7]"
          />
          <span class="text-[11px] text-[#182033] leading-relaxed">
            I understand that <strong>no payment is processed on this platform</strong>. I will arrange payment and delivery directly with {{ shop.name }}.
          </span>
        </label>
        <div v-if="form.errors.acknowledges_offline_sale" class="text-[10px] text-red-500">
          {{ form.errors.acknowledges_offline_sale }}
        </div>

        <button
          type="submit"
          :disabled="form.processing || !form.acknowledges_offline_sale"
          class="w-full py-3.5 bg-[#3F51D7] hover:bg-[#3142BD] disabled:bg-gray-300 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
        >
          <span v-if="form.processing">Submitting Inquiry...</span>
          <span v-else>Send Purchase Inquiry &rarr;</span>
        </button>
      </form>
    </div>
  </CustomerLayout>
</template>

<script setup>
import CustomerLayout from '@/Layouts/CustomerLayout.vue';
import { Link, useForm } from '@inertiajs/vue3';
import { computed } from 'vue';

const props = defineProps({
  shop: Object,
  product: Object,
  selectedVariant: Object,
  initialQuantity: Number,
  prefill: Object,
});

const unitPrice = computed(() => {
  if (props.selectedVariant?.price) return Number(props.selectedVariant.price);
  return Number(props.product.sale_price || props.product.price || 0);
});

const estimatedTotal = computed(() => {
  return (unitPrice.value * form.quantity).toFixed(2);
});

const form = useForm({
  customer_name: props.prefill?.name || '',
  customer_phone: props.prefill?.phone || '',
  customer_telegram_username: props.prefill?.telegram_username || '',
  product_variant_id: props.selectedVariant?.id || null,
  quantity: props.initialQuantity || 1,
  preferred_contact_method: 'either',
  customer_note: '',
  acknowledges_offline_sale: true,
});

function submitInquiry() {
  form.post(`/shops/${props.shop.slug}/products/${props.product.slug}/inquire`);
}
</script>
