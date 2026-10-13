<template>
  <ManagerLayout title="Inquiry Details" :shop="shop">
    <div class="mb-4">
      <Link href="/manager/inquiries" class="text-xs text-[#667085] hover:text-[#182033] flex items-center gap-1 font-medium">
        &larr; Back to all inquiries
      </Link>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Left 2 Cols: Details & Communication -->
      <div class="md:col-span-2 space-y-6">
        <!-- Inquiry Card -->
        <div class="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
          <div class="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <div>
              <span class="text-xs font-mono font-bold text-[#182033]">#{{ inquiry.reference_number }}</span>
              <div class="text-[11px] text-[#667085] mt-0.5">
                Received on {{ new Date(inquiry.created_at).toLocaleString() }}
              </div>
            </div>
            <span
              class="px-3 py-1 rounded-full font-bold capitalize text-xs"
              :class="{
                'bg-blue-50 text-blue-700 border border-blue-200': inquiry.status === 'sent',
                'bg-amber-50 text-amber-700 border border-amber-200': inquiry.status === 'viewed',
                'bg-emerald-50 text-emerald-700 border border-emerald-200': inquiry.status === 'responded',
                'bg-gray-100 text-gray-700': inquiry.status === 'closed',
                'bg-red-50 text-red-700 border border-red-200': inquiry.status === 'cancelled',
              }"
            >
              {{ inquiry.status }}
            </span>
          </div>

          <!-- Customer info -->
          <div class="bg-gray-50/70 rounded-2xl p-4 border border-gray-100 mb-4">
            <h4 class="text-xs font-bold uppercase tracking-wider text-[#667085] mb-2">Customer Details</h4>
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span class="text-[#667085] block">Full Name:</span>
                <span class="font-bold text-[#182033]">{{ inquiry.customer_name }}</span>
              </div>
              <div>
                <span class="text-[#667085] block">Phone Number:</span>
                <span class="font-bold text-[#182033]">{{ inquiry.customer_phone }}</span>
              </div>
              <div v-if="inquiry.customer_telegram_username">
                <span class="text-[#667085] block">Telegram:</span>
                <span class="font-bold text-[#3F51D7]">@{{ inquiry.customer_telegram_username }}</span>
              </div>
              <div>
                <span class="text-[#667085] block">Preferred Contact:</span>
                <span class="font-bold capitalize text-[#182033]">{{ inquiry.preferred_contact_method }}</span>
              </div>
            </div>
            <div v-if="inquiry.customer_note" class="mt-3 pt-2.5 border-t border-gray-200/60 text-xs">
              <span class="text-[#667085] block font-medium">Customer Note:</span>
              <p class="text-[#182033] mt-0.5 italic">"{{ inquiry.customer_note }}"</p>
            </div>
          </div>

          <!-- Direct action buttons -->
          <div class="grid grid-cols-2 gap-3">
            <a
              v-if="inquiry.customer_telegram_username"
              :href="`https://t.me/${inquiry.customer_telegram_username}`"
              target="_blank"
              class="py-3 px-4 rounded-xl bg-[#3F51D7] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#3142BD] transition shadow-xs"
            >
              <span>💬 Message on Telegram</span>
            </a>
            <a
              :href="`tel:${inquiry.customer_phone}`"
              class="py-3 px-4 rounded-xl border border-[#E6E8EF] text-[#182033] font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-50 transition"
            >
              <span>📞 Call Customer</span>
            </a>
          </div>
        </div>

        <!-- Immutable Snapshot Details -->
        <div class="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
          <h4 class="text-xs font-bold uppercase tracking-wider text-[#667085] mb-3">Product Snapshot At Inquiry Time</h4>
          <div class="flex gap-4 items-center">
            <img
              :src="inquiry.product_image_snapshot || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&auto=format&fit=crop'"
              class="w-16 h-16 rounded-xl object-cover border border-gray-100"
            />
            <div class="text-xs space-y-1">
              <div class="font-bold text-sm text-[#182033]">{{ inquiry.product_name_snapshot }}</div>
              <div v-if="inquiry.variant_description_snapshot" class="text-[#667085]">
                Variant: {{ inquiry.variant_description_snapshot }}
              </div>
              <div class="font-bold text-[#182033]">
                Requested Quantity: {{ inquiry.quantity }} &times; ${{ inquiry.unit_price_snapshot }} = ${{ inquiry.subtotal_snapshot }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Col: Update Status & Internal Notes -->
      <div class="space-y-6">
        <div class="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
          <h4 class="text-xs font-bold uppercase tracking-wider text-[#667085] mb-4">Inquiry Status Controls</h4>

          <form @submit.prevent="updateStatus" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-[#182033] mb-1">Update Status</label>
              <select v-model="form.status" class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none">
                <option value="viewed">Viewed</option>
                <option value="responded">Responded (Customer contacted)</option>
                <option value="closed">Closed (Deal arranged or completed)</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-[#182033] mb-1">Status Comment / Reason</label>
              <input
                v-model="form.comment"
                type="text"
                placeholder="e.g. Spoke on phone, delivery set for Friday"
                class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-[#182033] mb-1">Manager Notes (Private)</label>
              <textarea
                v-model="form.manager_notes"
                rows="3"
                placeholder="Internal notes about price agreed, payment details, etc..."
                class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="form.processing"
              class="w-full py-2.5 bg-[#3F51D7] text-white font-bold text-xs rounded-xl hover:bg-[#3142BD] transition shadow-xs disabled:opacity-50"
            >
              Update Status
            </button>
          </form>
        </div>

        <!-- Audit History -->
        <div class="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
          <h4 class="text-xs font-bold uppercase tracking-wider text-[#667085] mb-3">Status Timeline</h4>
          <div class="space-y-3">
            <div v-for="h in inquiry.histories" :key="h.id" class="text-xs border-l-2 border-[#3F51D7] pl-3 py-0.5">
              <div class="font-bold text-[#182033] capitalize">{{ h.to_status }}</div>
              <div class="text-[11px] text-[#667085]">{{ h.comment || 'Status change' }}</div>
              <div class="text-[10px] text-gray-400 mt-0.5">{{ new Date(h.created_at).toLocaleString() }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ManagerLayout>
</template>

<script setup>
import ManagerLayout from '@/Layouts/ManagerLayout.vue';
import { Link, useForm } from '@inertiajs/vue3';

const props = defineProps({
  shop: Object,
  inquiry: Object,
});

const form = useForm({
  status: props.inquiry.status === 'sent' ? 'viewed' : props.inquiry.status,
  comment: '',
  manager_notes: props.inquiry.manager_notes || '',
});

function updateStatus() {
  form.put(`/manager/inquiries/${props.inquiry.id}/status`);
}
</script>
