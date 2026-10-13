<template>
  <ManagerLayout title="Products" :shop="shop">
    <!-- Action Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <input
          v-model="search"
          @keyup.enter="applyFilter"
          type="text"
          placeholder="Search products..."
          class="bg-white border border-[#E6E8EF] rounded-xl px-3.5 py-2 text-xs focus:border-[#3F51D7] outline-none w-64 shadow-xs"
        />
        <select v-model="status" @change="applyFilter" class="bg-white border border-[#E6E8EF] rounded-xl px-3 py-2 text-xs outline-none shadow-xs">
          <option value="">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>

      <Link
        href="/manager/products/create"
        class="px-4 py-2 bg-[#3F51D7] hover:bg-[#3142BD] text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5"
      >
        <span>+ Add Product</span>
      </Link>
    </div>

    <!-- Product Table matching SellMate Screenshot -->
    <div class="bg-white rounded-3xl border border-[#E6E8EF] shadow-xs overflow-hidden">
      <table class="w-full text-left border-collapse text-xs">
        <thead>
          <tr class="border-b border-[#E6E8EF] bg-gray-50/75 text-[#667085]">
            <th class="py-3.5 px-5 font-semibold">Product Name</th>
            <th class="py-3.5 px-5 font-semibold">SKU</th>
            <th class="py-3.5 px-5 font-semibold">Price</th>
            <th class="py-3.5 px-5 font-semibold">Stock</th>
            <th class="py-3.5 px-5 font-semibold">Status</th>
            <th class="py-3.5 px-5 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="product in products.data" :key="product.id" class="hover:bg-gray-50/50">
            <td class="py-3.5 px-5">
              <div class="flex items-center gap-3">
                <img
                  :src="product.primary_image?.image_path || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=100&auto=format&fit=crop'"
                  :alt="product.name"
                  class="w-10 h-10 object-cover rounded-xl bg-gray-50 border border-gray-100"
                />
                <div>
                  <div class="font-bold text-[#182033]">{{ product.name }}</div>
                  <div class="text-[11px] text-[#667085]">{{ product.category?.name || 'Uncategorized' }}</div>
                </div>
              </div>
            </td>
            <td class="py-3.5 px-5 font-mono text-[#667085]">{{ product.sku || 'N/A' }}</td>
            <td class="py-3.5 px-5 font-bold text-[#182033]">
              {{ product.price ? `$${product.price}` : 'On request' }}
            </td>
            <td class="py-3.5 px-5">
              <span
                class="font-semibold"
                :class="product.stock <= 5 ? 'text-rose-600' : 'text-[#182033]'"
              >
                {{ product.stock }} Pieces
              </span>
            </td>
            <td class="py-3.5 px-5">
              <span
                class="px-2 py-0.5 rounded-full capitalize text-[10px] font-semibold"
                :class="{
                  'bg-emerald-50 text-emerald-700 border border-emerald-200': product.status === 'published',
                  'bg-gray-100 text-gray-700': product.status === 'draft',
                  'bg-amber-50 text-amber-700 border border-amber-200': product.status === 'hidden',
                }"
              >
                {{ product.status }}
              </span>
            </td>
            <td class="py-3.5 px-5 text-right space-x-2">
              <Link :href="`/manager/products/${product.id}/edit`" class="text-[#3F51D7] font-semibold hover:underline">
                Edit
              </Link>
              <button @click="deleteProduct(product.id)" class="text-rose-600 font-semibold hover:underline">
                Archive
              </button>
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
  products: Object,
  filters: Object,
});

const search = ref(props.filters?.search || '');
const status = ref(props.filters?.status || '');

function applyFilter() {
  router.get('/manager/products', { search: search.value, status: status.value }, { preserveState: true });
}

function deleteProduct(id) {
  if (confirm('Archive this product? Existing historical inquiries will keep their snapshots.')) {
    router.delete(`/manager/products/${id}`);
  }
}
</script>
