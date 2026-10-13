<template>
  <ManagerLayout title="Shop Settings & Public Contact" :shop="shop">
    <div class="max-w-2xl bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
      <h3 class="text-sm font-bold text-[#182033] mb-4">Shop Profile & Contact Information</h3>

      <form @submit.prevent="form.put('/manager/settings')" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-[#182033] mb-1">Shop Name</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-[#182033] mb-1">About / Bio</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none resize-none"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-[#182033] mb-1">Public Telegram Username</label>
            <div class="relative">
              <span class="absolute left-3 top-2.5 text-[#667085] text-xs">@</span>
              <input
                v-model="form.public_telegram_username"
                type="text"
                placeholder="shop_bot"
                class="w-full text-xs border border-[#E6E8EF] rounded-xl pl-7 pr-3 py-2.5 focus:border-[#3F51D7] outline-none"
              />
            </div>
            <p class="text-[10px] text-[#667085] mt-1">Customers will tap this to contact you directly on Telegram.</p>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#182033] mb-1">Public Phone Number</label>
            <input
              v-model="form.public_phone"
              type="tel"
              placeholder="+251 91 123 4567"
              class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-[#182033] mb-1">Store Address / Area</label>
          <input
            v-model="form.public_address"
            type="text"
            placeholder="e.g. Bole Medhanialem, Edna Mall 2nd Floor"
            class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-[#182033] mb-1">Delivery Policy & Note</label>
          <textarea
            v-model="form.delivery_note"
            rows="2"
            placeholder="e.g. Same-day motorbike delivery inside Addis Ababa, or in-store pickup."
            class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none resize-none"
          ></textarea>
        </div>

        <div class="pt-2">
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="form.notifications_enabled" type="checkbox" class="rounded text-[#3F51D7]" />
            <span class="text-xs font-medium text-[#182033]">
              Enable Telegram Bot notifications when new inquiries arrive
            </span>
          </label>
        </div>

        <div class="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            :disabled="form.processing"
            class="px-5 py-2.5 bg-[#3F51D7] text-white text-xs font-semibold rounded-xl hover:bg-[#3142BD] disabled:opacity-50"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  </ManagerLayout>
</template>

<script setup>
import ManagerLayout from '@/Layouts/ManagerLayout.vue';
import { useForm } from '@inertiajs/vue3';

const props = defineProps({
  shop: Object,
  categories: Array,
});

const form = useForm({
  name: props.shop.name,
  description: props.shop.description || '',
  logo: props.shop.logo || '',
  cover_image: props.shop.cover_image || '',
  category_id: props.shop.category_id,
  public_phone: props.shop.public_phone || '',
  public_telegram_username: props.shop.public_telegram_username || '',
  public_address: props.shop.public_address || '',
  business_hours: props.shop.business_hours || '',
  contact_method_preference: props.shop.contact_method_preference || 'both',
  delivery_note: props.shop.delivery_note || '',
  general_instructions: props.shop.general_instructions || '',
  notifications_enabled: Boolean(props.shop.notifications_enabled),
});
</script>
