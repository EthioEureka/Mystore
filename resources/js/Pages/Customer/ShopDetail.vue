<template>
  <CustomerLayout :title="shop.name">
    <!-- Shop Banner & Header -->
    <div class="bg-white rounded-3xl p-5 border border-[#E6E8EF] shadow-xs mb-5">
      <div class="flex items-center gap-3.5 mb-3">
        <div class="w-14 h-14 rounded-2xl bg-[#EEF0FD] text-[#3F51D7] font-black text-xl flex items-center justify-center border border-[#3F51D7]/20 shadow-xs">
          {{ shop.name.charAt(0) }}
        </div>
        <div>
          <h2 class="text-base font-bold text-[#182033]">{{ shop.name }}</h2>
          <span class="inline-block text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full mt-0.5">
            Verified Merchant
          </span>
        </div>
      </div>

      <p class="text-xs text-[#667085] leading-relaxed mb-4">
        {{ shop.description || 'Welcome to our shop on Telegram Marketplace!' }}
      </p>

      <!-- Shop details & direct contact -->
      <div class="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
        <div v-if="shop.public_address" class="text-[#667085]">
          📍 {{ shop.public_address }}
        </div>
        <div v-if="shop.business_hours" class="text-[#667085]">
          🕒 {{ shop.business_hours }}
        </div>
      </div>

      <!-- Action buttons -->
      <div class="mt-4 pt-3 border-t border-gray-100 flex gap-2">
        <a
          v-if="shop.public_telegram_username"
          :href="`https://t.me/${shop.public_telegram_username}`"
          target="_blank"
          class="flex-1 py-2 px-3 bg-[#3F51D7] text-white text-xs font-semibold rounded-xl text-center shadow-xs"
        >
          Message on Telegram
        </a>
        <a
          v-if="shop.public_phone"
          :href="`tel:${shop.public_phone}`"
          class="flex-1 py-2 px-3 border border-[#E6E8EF] text-[#182033] text-xs font-semibold rounded-xl text-center hover:bg-gray-50"
        >
          Call Shop
        </a>
      </div>
    </div>

    <!-- Products grid -->
    <div class="mb-6">
      <h3 class="text-sm font-bold text-[#182033] mb-3">Products from {{ shop.name }}</h3>

      <div class="grid grid-cols-2 gap-3.5">
        <div
          v-for="product in products.data"
          :key="product.id"
          class="bg-white border border-[#E6E8EF] rounded-2xl overflow-hidden shadow-xs hover:border-[#3F51D7] transition flex flex-col group"
        >
          <Link :href="`/shops/${shop.slug}/products/${product.slug}`" class="block aspect-square bg-gray-50 overflow-hidden">
            <img
              :src="product.primary_image?.image_path || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop'"
              :alt="product.name"
              class="w-full h-full object-cover"
            />
          </Link>
          <div class="p-3 flex-1 flex flex-col justify-between">
            <Link :href="`/shops/${shop.slug}/products/${product.slug}`" class="text-xs font-semibold text-[#182033] line-clamp-2">
              {{ product.name }}
            </Link>
            <div class="mt-2.5 pt-2 border-t border-gray-50 flex items-center justify-between">
              <span class="text-xs font-bold text-[#182033]">
                ${{ product.price }}
              </span>
              <Link
                :href="`/shops/${shop.slug}/products/${product.slug}/inquire`"
                class="text-[11px] font-semibold text-[#3F51D7] hover:underline"
              >
                Inquire &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </CustomerLayout>
</template>

<script setup>
import CustomerLayout from '@/Layouts/CustomerLayout.vue';
import { Link } from '@inertiajs/vue3';

defineProps({
  shop: Object,
  products: Object,
});
</script>
