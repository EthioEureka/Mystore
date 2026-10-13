<template>
  <AdminLayout title="Platform & Telegram Settings">
    <div class="max-w-xl bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
      <h3 class="text-sm font-bold text-[#182033] mb-4">Marketplace Configuration</h3>

      <!-- Telegram Bot Integration Status -->
      <div class="p-4 rounded-2xl border mb-6" :class="telegram_configured ? 'bg-emerald-50/60 border-emerald-200' : 'bg-amber-50/60 border-amber-200'">
        <div class="flex items-center gap-2">
          <span class="text-base">{{ telegram_configured ? '✅' : '⚠️' }}</span>
          <div class="text-xs">
            <span class="font-bold text-[#182033]">Telegram Bot Integration</span>
            <p class="text-[#667085] mt-0.5">
              {{ telegram_configured ? `Connected with bot @${telegram_bot_username}` : 'TELEGRAM_BOT_TOKEN is not set in .env yet. Bot notifications will run in safe mock mode.' }}
            </p>
          </div>
        </div>
      </div>

      <form @submit.prevent="form.post('/admin/settings')" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-[#182033] mb-1">Marketplace Name</label>
          <input
            v-model="form.marketplace_name"
            type="text"
            required
            class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-[#182033] mb-1">Default Display Currency</label>
          <input
            v-model="form.default_currency"
            type="text"
            required
            class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 outline-none font-mono"
          />
        </div>

        <div class="space-y-2 pt-2">
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="form.allow_shop_registration" type="checkbox" class="rounded text-[#3F51D7]" />
            <span class="text-xs font-medium text-[#182033]">Allow public merchant registration</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="form.require_shop_approval" type="checkbox" class="rounded text-[#3F51D7]" />
            <span class="text-xs font-medium text-[#182033]">Require admin approval before shops can accept inquiries</span>
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
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { useForm } from '@inertiajs/vue3';

const props = defineProps({
  settings: Object,
  telegram_configured: Boolean,
  telegram_bot_username: String,
});

const form = useForm({
  marketplace_name: props.settings?.marketplace_name || 'Telegram Shop Marketplace',
  default_currency: props.settings?.default_currency || 'ETB',
  allow_shop_registration: Boolean(Number(props.settings?.allow_shop_registration ?? 1)),
  require_shop_approval: Boolean(Number(props.settings?.require_shop_approval ?? 1)),
});
</script>
