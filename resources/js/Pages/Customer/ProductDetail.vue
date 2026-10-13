<template>
  <CustomerLayout title="Product Details">
    <!-- Breadcrumb / Back Navigation -->
    <div class="flex items-center justify-between mb-3 text-xs">
      <Link href="/" class="text-[#667085] hover:text-[#182033] flex items-center gap-1 font-medium">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        <span>Back to search</span>
      </Link>
      <button
        @click="toggleSave"
        class="w-8 h-8 rounded-full bg-white border border-[#E6E8EF] flex items-center justify-center text-gray-500 hover:text-red-500 shadow-xs transition"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
      </button>
    </div>

    <!-- Product Image Gallery (Beats style presentation) -->
    <div class="bg-white rounded-3xl p-4 border border-[#E6E8EF] shadow-xs mb-4">
      <div class="aspect-square w-full rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden relative">
        <img
          :src="activeImage || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop'"
          :alt="product.name"
          class="w-full h-full object-contain p-4"
        />
        <div class="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-[11px] font-semibold text-[#182033] px-2.5 py-1 rounded-full border border-gray-200">
          {{ product.availability_status === 'in_stock' ? '🟢 In stock' : (product.availability_status === 'low_stock' ? '🟡 Low stock' : '🔴 Out of stock') }}
        </div>
      </div>
    </div>

    <!-- Product Details Card -->
    <div class="bg-white rounded-3xl p-5 border border-[#E6E8EF] shadow-xs mb-4">
      <!-- Shop badge -->
      <Link :href="`/shops/${shop.slug}`" class="inline-flex items-center gap-1.5 text-xs text-[#3F51D7] font-semibold hover:underline mb-1.5">
        <span>🏪 {{ shop.name }}</span>
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </Link>

      <!-- Title & Price -->
      <h2 class="text-xl font-bold text-[#182033] leading-snug">
        {{ product.name }}
      </h2>

      <div class="flex items-baseline gap-2 mt-2 pb-4 border-b border-gray-100">
        <span class="text-2xl font-black text-[#182033]">
          {{ product.price ? `$${product.price}` : 'Price on request' }}
        </span>
        <span v-if="product.sale_price" class="text-sm text-gray-400 line-through">
          ${{ product.sale_price }}
        </span>
        <span class="text-xs text-[#667085] ml-auto">
          Est. delivery 2-4 days
        </span>
      </div>

      <!-- Description -->
      <div class="py-4 border-b border-gray-100">
        <h4 class="text-xs font-bold uppercase tracking-wider text-[#667085] mb-1.5">Overview</h4>
        <p class="text-xs text-[#182033] leading-relaxed">
          {{ product.description || 'Quality product available directly from merchant.' }}
        </p>
      </div>

      <!-- Variant Selectors if product has variants -->
      <div v-if="product.variants?.length" class="py-4 border-b border-gray-100">
        <label class="text-xs font-bold uppercase tracking-wider text-[#667085] block mb-2">
          Select Variant / Color
        </label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="v in product.variants"
            :key="v.id"
            @click="selectedVariantId = v.id"
            type="button"
            class="p-2.5 rounded-xl border text-left text-xs transition"
            :class="selectedVariantId === v.id ? 'border-[#3F51D7] bg-[#EEF0FD] text-[#3F51D7] font-semibold shadow-xs' : 'border-[#E6E8EF] text-[#182033] hover:bg-gray-50'"
          >
            <div class="truncate">{{ v.name }}</div>
            <div class="text-[11px] text-[#667085] mt-0.5">
              {{ v.stock > 0 ? `${v.stock} in stock` : 'Out of stock' }}
            </div>
          </button>
        </div>
      </div>

      <!-- Quantity Selector -->
      <div class="py-4 flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-[#182033] block">Quantity</span>
          <span class="text-[11px] text-[#667085]">Max 10 per inquiry</span>
        </div>
        <div class="flex items-center gap-2 border border-[#E6E8EF] rounded-xl p-1 bg-gray-50">
          <button
            @click="quantity = Math.max(1, quantity - 1)"
            class="w-7 h-7 rounded-lg bg-white flex items-center justify-center font-bold text-sm text-[#182033] shadow-xs disabled:opacity-50"
            :disabled="quantity <= 1"
          >
            -
          </button>
          <span class="w-6 text-center text-xs font-bold text-[#182033]">{{ quantity }}</span>
          <button
            @click="quantity = Math.min(10, quantity + 1)"
            class="w-7 h-7 rounded-lg bg-white flex items-center justify-center font-bold text-sm text-[#182033] shadow-xs"
          >
            +
          </button>
        </div>
      </div>

      <!-- Important Offline Note -->
      <div class="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-[11px] text-amber-900 leading-relaxed mb-4">
        <strong>⚠️ Direct purchase:</strong> Submitting an inquiry contacts the shop owner directly. Payment and final delivery arrangements happen outside the platform.
      </div>

      <!-- Primary CTA: Request to Buy -->
      <Link
        :href="inquiryCheckoutUrl"
        class="w-full py-3.5 bg-[#3F51D7] hover:bg-[#3142BD] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
      >
        <span>Request to Buy / Inquire</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
      </Link>

      <!-- Secondary Direct Shop Contact Actions -->
      <div class="grid grid-cols-2 gap-2 mt-2.5">
        <a
          v-if="shop.public_telegram_username"
          :href="`https://t.me/${shop.public_telegram_username}`"
          target="_blank"
          class="py-2.5 px-3 rounded-xl border border-[#E6E8EF] text-center text-xs font-semibold text-[#182033] hover:bg-gray-50 transition flex items-center justify-center gap-1.5"
        >
          <span>💬 Telegram Shop</span>
        </a>
        <a
          v-if="shop.public_phone"
          :href="`tel:${shop.public_phone}`"
          class="py-2.5 px-3 rounded-xl border border-[#E6E8EF] text-center text-xs font-semibold text-[#182033] hover:bg-gray-50 transition flex items-center justify-center gap-1.5"
        >
          <span>📞 Call Shop</span>
        </a>
      </div>
    </div>
  </CustomerLayout>
</template>

<script setup>
import CustomerLayout from '@/Layouts/CustomerLayout.vue';
import { Link, router } from '@inertiajs/vue3';
import { computed, ref } from 'vue';

const props = defineProps({
  shop: Object,
  product: Object,
  relatedProducts: Array,
});

const quantity = ref(1);
const selectedVariantId = ref(props.product.variants?.[0]?.id || null);
const activeImage = ref(props.product.images?.[0]?.image_path || props.product.primary_image || null);

const inquiryCheckoutUrl = computed(() => {
  let url = `/shops/${props.shop.slug}/products/${props.product.slug}/inquire?quantity=${quantity.value}`;
  if (selectedVariantId.value) {
    url += `&variant_id=${selectedVariantId.value}`;
  }
  return url;
});

function toggleSave() {
  router.post(`/products/${props.product.id}/favorite`, {}, { preserveScroll: true });
}
</script>
