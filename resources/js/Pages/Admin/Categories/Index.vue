<template>
  <AdminLayout title="Manage Categories">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-2 bg-white rounded-3xl border border-[#E6E8EF] shadow-xs overflow-hidden">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="border-b border-[#E6E8EF] bg-gray-50/75 text-[#667085]">
              <th class="py-3.5 px-5 font-semibold">Name</th>
              <th class="py-3.5 px-5 font-semibold">Slug</th>
              <th class="py-3.5 px-5 font-semibold">Products</th>
              <th class="py-3.5 px-5 font-semibold">Order</th>
              <th class="py-3.5 px-5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="cat in categories" :key="cat.id" class="hover:bg-gray-50/50">
              <td class="py-3.5 px-5 font-bold text-[#182033]">{{ cat.name }}</td>
              <td class="py-3.5 px-5 font-mono text-[#667085]">{{ cat.slug }}</td>
              <td class="py-3.5 px-5">{{ cat.products_count }}</td>
              <td class="py-3.5 px-5">{{ cat.display_order }}</td>
              <td class="py-3.5 px-5">
                <span class="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                  Active
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add Category Form -->
      <div class="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
        <h4 class="text-sm font-bold text-[#182033] mb-4">Add New Category</h4>
        <form @submit.prevent="form.post('/admin/categories', { onSuccess: () => form.reset() })" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-[#182033] mb-1">Category Name</label>
            <input
              v-model="form.name"
              type="text"
              required
              @input="form.slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')"
              class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-[#182033] mb-1">Slug</label>
            <input
              v-model="form.slug"
              type="text"
              required
              class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 outline-none font-mono"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-[#182033] mb-1">Display Order</label>
            <input
              v-model="form.display_order"
              type="number"
              required
              class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 outline-none"
            />
          </div>

          <button
            type="submit"
            :disabled="form.processing"
            class="w-full py-2.5 bg-[#3F51D7] text-white font-bold text-xs rounded-xl hover:bg-[#3142BD]"
          >
            Create Category
          </button>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { useForm } from '@inertiajs/vue3';

defineProps({
  categories: Array,
});

const form = useForm({
  name: '',
  slug: '',
  display_order: 10,
  is_active: true,
});
</script>
