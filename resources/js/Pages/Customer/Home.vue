<template>
  <CustomerLayout title="Discover Products & Shops">
    <!-- Search Bar with pill style matching spec -->
    <div class="relative mb-5">
      <input
        v-model="searchQuery"
        @keyup.enter="performSearch"
        type="text"
        placeholder="Wireless headphones, beauty, shops..."
        class="w-full bg-white border border-[#E6E8EF] rounded-2xl py-3 pl-11 pr-10 text-sm shadow-xs focus:outline-none focus:border-[#3F51D7] focus:ring-2 focus:ring-[#3F51D7]/20 placeholder-[#667085]"
      />
      <div class="absolute left-3.5 top-3.5 text-[#667085]">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      </div>
      <button
        v-if="searchQuery"
        @click="searchQuery = ''; performSearch()"
        class="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>

    <!-- Featured Promo Card (Rose Hibiscus Mist hero card from Figma screenshot) -->
    <div class="relative bg-gradient-to-r from-rose-100 to-amber-50 rounded-2xl p-4.5 mb-6 border border-rose-200/50 shadow-xs flex items-center justify-between overflow-hidden">
      <div class="z-10 max-w-[62%]">
        <span class="text-[11px] font-bold uppercase tracking-wider text-rose-800">Herbivore</span>
        <h3 class="text-base font-bold text-[#182033] leading-snug mt-0.5">
          Rose Hibiscus Face Mist
        </h3>
        <div class="flex items-baseline gap-2 mt-1">
          <span class="text-sm font-extrabold text-[#182033]">$34.20</span>
          <span class="text-xs text-gray-400 line-through">36.00</span>
        </div>
        <Link
          href="/shops/herbivore-botanicals/products/rose-hibiscus-hydrating-face-mist"
          class="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-[#3F51D7] text-white text-xs font-semibold rounded-xl shadow-xs hover:bg-[#3142BD] transition"
        >
          <span>Request to Buy</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </Link>
      </div>
      <img
        src="https://images.unsplash.com/photo-1608248597359-bb4360e7e1f4?w=300&auto=format&fit=crop"
        alt="Rose Mist"
        class="w-24 h-24 object-contain rounded-xl drop-shadow-md shrink-0"
      />
    </div>

    <!-- Popular Categories -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-bold text-[#182033]">Popular categories</h3>
        <Link href="/categories" class="text-xs font-semibold text-[#3F51D7] hover:underline flex items-center gap-0.5">
          <span>See all</span>
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </Link>
      </div>

      <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
        <Link
          v-for="cat in categories"
          :key="cat.id"
          :href="`/search?category=${cat.slug}`"
          class="flex flex-col items-center gap-1.5 shrink-0 group"
        >
          <div class="w-14 h-14 rounded-2xl bg-white border border-[#E6E8EF] flex items-center justify-center text-[#182033] shadow-xs group-hover:border-[#3F51D7] group-hover:bg-[#EEF0FD] transition">
            <span class="text-xl">🏷️</span>
          </div>
          <span class="text-xs font-medium text-[#182033] group-hover:text-[#3F51D7]">{{ cat.name }}</span>
        </Link>
      </div>
    </div>

    <!-- Featured Approved Shops -->
    <div v-if="featuredShops?.length" class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-bold text-[#182033]">Featured Shops</h3>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <Link
          v-for="shop in featuredShops"
          :key="shop.id"
          :href="`/shops/${shop.slug}`"
          class="bg-white border border-[#E6E8EF] rounded-2xl p-3 shadow-xs hover:border-[#3F51D7] transition flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center gap-2 mb-1.5">
              <div class="w-7 h-7 rounded-lg bg-[#EEF0FD] text-[#3F51D7] font-bold text-xs flex items-center justify-center">
                {{ shop.name.charAt(0) }}
              </div>
              <h4 class="text-xs font-bold text-[#182033] truncate">{{ shop.name }}</h4>
            </div>
            <p class="text-[11px] text-[#667085] line-clamp-2 leading-relaxed">
              {{ shop.description }}
            </p>
          </div>
          <div class="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#667085]">
            <span>{{ shop.products_count }} items</span>
            <span class="text-[#3F51D7] font-semibold">Visit &rarr;</span>
          </div>
        </Link>
      </div>
    </div>

    <!-- Two-column Product Grid (Figma style) -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-bold text-[#182033]">Explore Products</h3>
      </div>

      <div class="grid grid-cols-2 gap-3.5">
        <div
          v-for="product in products"
          :key="product.id"
          class="bg-white border border-[#E6E8EF] rounded-2xl overflow-hidden shadow-xs hover:border-[#3F51D7] transition flex flex-col group relative"
        >
          <!-- Product Image -->
          <Link :href="`/shops/${product.shop.slug}/products/${product.slug}`" class="block aspect-square bg-gray-50 overflow-hidden relative">
            <img
              :src="product.primary_image || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop'"
              :alt="product.name"
              class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            <span
              v-if="product.availability === 'in_stock'"
              class="absolute top-2 left-2 text-[10px] font-semibold bg-emerald-500/90 text-white px-1.5 py-0.5 rounded-md backdrop-blur-xs"
            >
              In stock
            </span>
            <span
              v-else-if="product.availability === 'low_stock'"
              class="absolute top-2 left-2 text-[10px] font-semibold bg-amber-500/90 text-white px-1.5 py-0.5 rounded-md backdrop-blur-xs"
            >
              Low stock
            </span>
          </Link>

          <!-- Favorite Icon Button -->
          <button
            @click.stop="toggleSave(product.id)"
            class="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-400 hover:text-red-500 shadow-xs transition"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          </button>

          <!-- Card Content -->
          <div class="p-3 flex-1 flex flex-col justify-between">
            <div>
              <Link :href="`/shops/${product.shop.slug}`" class="text-[11px] text-[#667085] hover:text-[#3F51D7] truncate block mb-0.5">
                {{ product.shop.name }}
              </Link>
              <Link :href="`/shops/${product.shop.slug}/products/${product.slug}`" class="text-xs font-semibold text-[#182033] line-clamp-2 leading-snug group-hover:text-[#3F51D7] transition">
                {{ product.name }}
              </Link>
            </div>

            <div class="mt-2.5 pt-2 border-t border-gray-50 flex items-center justify-between">
              <div>
                <span class="text-xs font-bold text-[#182033]">
                  {{ product.price ? `$${product.price}` : 'Price on request' }}
                </span>
                <span v-if="product.sale_price" class="text-[10px] text-gray-400 line-through ml-1">
                  ${{ product.sale_price }}
                </span>
              </div>
              <Link
                :href="`/shops/${product.shop.slug}/products/${product.slug}/inquire`"
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
import { Link, router } from '@inertiajs/vue3';
import { ref } from 'vue';

const props = defineProps({
  categories: Array,
  featuredShops: Array,
  products: Array,
});

const searchQuery = ref('');

function performSearch() {
  if (searchQuery.value.trim()) {
    router.get('/search', { q: searchQuery.value.trim() });
  }
}

function toggleSave(productId) {
  router.post(`/products/${productId}/favorite`, {}, { preserveScroll: true });
}
</script>
