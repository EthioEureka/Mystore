<template>
  <CustomerLayout title="Browse Categories">
    <div class="mb-4">
      <h3 class="text-sm font-bold text-[#182033]">All Marketplace Categories</h3>
    </div>

    <div class="grid grid-cols-2 gap-3 mb-6">
      <Link
        v-for="cat in categories"
        :key="cat.id"
        :href="`/search?category=${cat.slug}`"
        class="bg-white border border-[#E6E8EF] rounded-2xl p-4 shadow-xs hover:border-[#3F51D7] transition flex items-center gap-3"
      >
        <div class="w-10 h-10 rounded-xl bg-[#EEF0FD] text-[#3F51D7] flex items-center justify-center text-lg">
          🏷️
        </div>
        <div>
          <h4 class="text-xs font-bold text-[#182033]">{{ cat.name }}</h4>
          <span class="text-[11px] text-[#667085]">{{ cat.products_count }} items</span>
        </div>
      </Link>
    </div>
  </CustomerLayout>
</template>

<script setup>
import CustomerLayout from '@/Layouts/CustomerLayout.vue';
import { Link } from '@inertiajs/vue3';

defineProps({
  categories: Array,
});
</script>
