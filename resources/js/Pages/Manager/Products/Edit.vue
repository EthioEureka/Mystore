<template>
  <ManagerLayout title="Edit Product" :shop="shop">
    <div class="max-w-2xl bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
      <h3 class="text-sm font-bold text-[#182033] mb-4">Edit Product: {{ product.name }}</h3>

      <form @submit.prevent="form.put(`/manager/products/${product.id}`)" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-[#182033] mb-1">Product Name</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-[#182033] mb-1">Category</label>
            <select v-model="form.category_id" class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none">
              <option :value="null">No category</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-[#182033] mb-1">SKU</label>
            <input
              v-model="form.sku"
              type="text"
              class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-[#182033] mb-1">Description</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none resize-none"
          ></textarea>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-bold text-[#182033] mb-1">Price (USD)</label>
            <input
              v-model="form.price"
              type="number"
              step="0.01"
              class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-[#182033] mb-1">Sale Price</label>
            <input
              v-model="form.sale_price"
              type="number"
              step="0.01"
              class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-[#182033] mb-1">Current Stock</label>
            <input
              v-model="form.stock"
              type="number"
              required
              class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-[#182033] mb-1">Product Image URL</label>
          <input
            v-model="form.image_url"
            type="url"
            class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-[#182033] mb-1">Listing Status</label>
          <select v-model="form.status" class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none">
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>

        <div class="pt-4 border-t border-gray-100 flex justify-end gap-2">
          <Link href="/manager/products" class="px-4 py-2 border border-[#E6E8EF] rounded-xl text-xs font-semibold hover:bg-gray-50">
            Cancel
          </Link>
          <button
            type="submit"
            :disabled="form.processing"
            class="px-5 py-2 bg-[#3F51D7] text-white text-xs font-semibold rounded-xl hover:bg-[#3142BD] disabled:opacity-50"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  </ManagerLayout>
</template>

<script setup>
import ManagerLayout from '@/Layouts/ManagerLayout.vue';
import { Link, useForm } from '@inertiajs/vue3';

const props = defineProps({
  shop: Object,
  product: Object,
  categories: Array,
});

const form = useForm({
  name: props.product.name,
  category_id: props.product.category_id,
  description: props.product.description || '',
  sku: props.product.sku || '',
  price: props.product.price,
  sale_price: props.product.sale_price,
  currency: props.product.currency || 'USD',
  stock: props.product.stock,
  status: props.product.status,
  image_url: props.product.images?.[0]?.image_path || '',
});
</script>
