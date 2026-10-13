<template>
  <CustomerLayout title="Search & Filter">
    <!-- Search Bar -->
    <div class="relative mb-4">
      <input
        v-model="query"
        @keyup.enter="applyFilters"
        type="text"
        placeholder="Wireless headphones, cosmetics, brands..."
        class="w-full bg-white border border-[#E6E8EF] rounded-2xl py-3 pl-11 pr-10 text-sm shadow-xs focus:outline-none focus:border-[#3F51D7] focus:ring-1 focus:ring-[#3F51D7]"
      />
      <div class="absolute left-3.5 top-3.5 text-[#667085]">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      </div>
    </div>

    <!-- Filter chips -->
    <div class="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-4 px-4 scrollbar-none">
      <button
        @click="category = ''; applyFilters()"
        class="px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition"
        :class="!category ? 'bg-[#3F51D7] text-white' : 'bg-white border border-[#E6E8EF] text-[#667085]'"
      >
        All Categories
      </button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="category = cat.slug; applyFilters()"
        class="px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition"
        :class="category === cat.slug ? 'bg-[#3F51D7] text-white' : 'bg-white border border-[#E6E8EF] text-[#667085]'"
      >
        {{ cat.name }}
      </button>
    </div>

    <!-- Results count & sort selector -->
    <div class="flex items-center justify-between mb-4 text-xs text-[#667085]">
      <span>{{ products.total || 0 }} products found</span>
      <select v-model="sort" @change="applyFilters" class="bg-white border border-[#E6E8EF] rounded-lg px-2 py-1 text-xs">
        <option value="newest">Newest first</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>

    <!-- Products Grid -->
    <div v-if="products.data?.length" class="grid grid-cols-2 gap-3.5 mb-6">
      <div
        v-for="product in products.data"
        :key="product.id"
        class="bg-white border border-[#E6E8EF] rounded-2xl overflow-hidden shadow-xs hover:border-[#3F51D7] transition flex flex-col group"
      >
        <Link :href="`/shops/${product.shop.slug}/products/${product.slug}`" class="block aspect-square bg-gray-50 overflow-hidden relative">
          <img
            :src="product.primary_image?.image_path || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop'"
            :alt="product.name"
            class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        </Link>
        <div class="p-3 flex-1 flex flex-col justify-between">
          <div>
            <span class="text-[11px] text-[#667085] truncate block">{{ product.shop?.name }}</span>
            <Link :href="`/shops/${product.shop.slug}/products/${product.slug}`" class="text-xs font-semibold text-[#182033] line-clamp-2 leading-snug">
              {{ product.name }}
            </Link>
          </div>
          <div class="mt-2.5 pt-2 border-t border-gray-50 flex items-center justify-between">
            <span class="text-xs font-bold text-[#182033]">
              {{ product.price ? `$${product.price}` : 'On request' }}
            </span>
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

    <!-- Empty State -->
    <div v-else class="bg-white rounded-3xl p-8 border border-[#E6E8EF] text-center shadow-xs">
      <div class="text-3xl mb-2">🔍</div>
      <h4 class="text-sm font-bold text-[#182033]">No products match your search</h4>
      <p class="text-xs text-[#667085] mt-1 max-w-xs mx-auto">
        Try adjusting your keywords or clearing category filters.
      </p>
      <button
        @click="query = ''; category = ''; applyFilters()"
        class="mt-4 px-4 py-2 bg-[#3F51D7] text-white text-xs font-semibold rounded-xl hover:bg-[#3142BD]"
      >
        Clear Filters
      </button>
    </div>
  </CustomerLayout>
</template>

<script setup>
import CustomerLayout from '@/Layouts/CustomerLayout.vue';
import { Link, router } from '@inertiajs/vue3';
import { ref } from 'vue';

const props = defineProps({
  products: Object,
  categories: Array,
  filters: Object,
});

const query = ref(props.filters?.q || '');
const category = ref(props.filters?.category || '');
const sort = ref(props.filters?.sort || 'newest');

function applyFilters() {
  router.get('/search', {
    q: query.value,
    category: category.value,
    sort: sort.value,
  }, { preserveState: true });
}
</script>
