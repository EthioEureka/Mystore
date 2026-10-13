<template>
  <ManagerLayout title="Inventory & Stock Movements" :shop="shop">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Left 2 Cols: Products Stock Table -->
      <div class="md:col-span-2 bg-white rounded-3xl border border-[#E6E8EF] shadow-xs overflow-hidden">
        <div class="p-5 border-b border-[#E6E8EF] flex items-center justify-between">
          <h3 class="text-sm font-bold text-[#182033]">Current Product Stock</h3>
        </div>

        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="border-b border-[#E6E8EF] bg-gray-50/75 text-[#667085]">
              <th class="py-3.5 px-5 font-semibold">Product</th>
              <th class="py-3.5 px-5 font-semibold">SKU</th>
              <th class="py-3.5 px-5 font-semibold">Current Stock</th>
              <th class="py-3.5 px-5 font-semibold text-right">Quick Adjust</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="product in products.data" :key="product.id" class="hover:bg-gray-50/50">
              <td class="py-3.5 px-5 font-medium text-[#182033]">{{ product.name }}</td>
              <td class="py-3.5 px-5 font-mono text-[#667085]">{{ product.sku || '-' }}</td>
              <td class="py-3.5 px-5">
                <span
                  class="font-bold px-2 py-0.5 rounded-full"
                  :class="product.stock <= 5 ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'"
                >
                  {{ product.stock }} pcs
                </span>
              </td>
              <td class="py-3.5 px-5 text-right">
                <button
                  @click="openAdjust(product)"
                  class="text-xs font-semibold text-[#3F51D7] hover:underline"
                >
                  Adjust &rarr;
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Right Col: Recent Movement Audit Log -->
      <div class="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
        <h3 class="text-sm font-bold text-[#182033] mb-4">Stock Movement Audit</h3>
        <div class="space-y-3.5">
          <div v-for="m in movements" :key="m.id" class="text-xs border-b border-gray-100 pb-2.5">
            <div class="flex items-center justify-between">
              <span class="font-bold text-[#182033] truncate">{{ m.product?.name }}</span>
              <span class="font-mono font-bold" :class="m.quantity_change >= 0 ? 'text-emerald-600' : 'text-red-600'">
                {{ m.quantity_change > 0 ? `+${m.quantity_change}` : m.quantity_change }}
              </span>
            </div>
            <div class="text-[11px] text-[#667085] flex items-center justify-between mt-0.5">
              <span>{{ m.reason || m.type }}</span>
              <span>After: {{ m.quantity_after }}</span>
            </div>
            <div class="text-[10px] text-gray-400 mt-0.5">
              {{ new Date(m.created_at).toLocaleString() }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Adjust Modal -->
    <div v-if="adjustProduct" class="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-sm w-full p-6 border border-[#E6E8EF] shadow-lg">
        <h4 class="text-sm font-bold text-[#182033] mb-1">Adjust Stock: {{ adjustProduct.name }}</h4>
        <p class="text-xs text-[#667085] mb-4">Current quantity: <strong>{{ adjustProduct.stock }}</strong></p>

        <form @submit.prevent="submitAdjust" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-[#182033] mb-1">Action Type</label>
            <select v-model="adjustForm.adjustment_type" class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 outline-none">
              <option value="set">Set exact stock</option>
              <option value="add">Add received units</option>
              <option value="remove">Deduct units (sale/damage)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#182033] mb-1">Quantity</label>
            <input
              v-model="adjustForm.quantity"
              type="number"
              min="0"
              required
              class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-[#182033] mb-1">Reason</label>
            <input
              v-model="adjustForm.reason"
              type="text"
              placeholder="e.g. Restocked 20 units from supplier"
              class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 outline-none"
            />
          </div>

          <div class="flex gap-2 justify-end pt-2">
            <button
              type="button"
              @click="adjustProduct = null"
              class="px-4 py-2 text-xs font-semibold border border-[#E6E8EF] rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="adjustForm.processing"
              class="px-4 py-2 text-xs font-semibold bg-[#3F51D7] text-white rounded-xl hover:bg-[#3142BD]"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  </ManagerLayout>
</template>

<script setup>
import ManagerLayout from '@/Layouts/ManagerLayout.vue';
import { useForm } from '@inertiajs/vue3';
import { ref } from 'vue';

const props = defineProps({
  shop: Object,
  products: Object,
  movements: Array,
});

const adjustProduct = ref(null);
const adjustForm = useForm({
  adjustment_type: 'add',
  quantity: 5,
  reason: '',
});

function openAdjust(prod) {
  adjustProduct.value = prod;
  adjustForm.quantity = 5;
  adjustForm.reason = '';
}

function submitAdjust() {
  adjustForm.post(`/manager/products/${adjustProduct.value.id}/stock`, {
    onSuccess: () => {
      adjustProduct.value = null;
    },
  });
}
</script>
